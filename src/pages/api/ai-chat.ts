import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
// Replace with the correct import path for CohereEmbeddings
import { CohereEmbeddings } from "@langchain/cohere";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type RequestData = {
  messages: Message[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body as RequestData;
    
    // Get the latest user message
    const latestUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

    // Prepare the conversation history for GROQ API
    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Get PDF content and create a retrieval system
    //const pdfPath = path.join(process.cwd(), 'public', 'assets', 'documents', 'AnishShah227.pdf');
    const pdfPath = './public/assets/documents/AnishShah227.pdf';
    // Load the PDF document
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();
    
    // Split the document into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);
    
    // Create a vector store from the document chunks
    // Using Cohere embeddings which offers free tier credits
    const vectorStore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      new CohereEmbeddings({
        apiKey: process.env.COHERE_API_KEY,
        model: "embed-english-v3.0", // Specify the model name
      })
    );
    
    // Retrieve relevant document chunks based on the user's question
    const relevantDocs = await vectorStore.similaritySearch(latestUserMessage, 3);
    
    // Extract the content from the relevant documents
    const contextText = relevantDocs.map(doc => doc.pageContent).join("\n\n");
    
    // Call GROQ API with the retrieved context
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192', // Use appropriate GROQ model (llama3-8b-8192, llama3-70b-8192, etc.)
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant created by Anish, that answers questions about Anish Shah based ONLY on the information from his PDF document.
              
              Important rules:
              1. Only answer questions if the information is explicitly found in the provided context.
              2. If the question cannot be answered using information from the context, respond with exactly "No Data found".
              3. Do not make up or infer information that is not directly stated in the document.
              4. Keep answers concise and directly related to the question.
              5. If only partial information is available, provide what you can find and indicate that the information is limited.
              
              Here is the context from the PDF document:
              ${contextText}`
            },
            ...conversationHistory
          ],
          temperature: 0.3, // Lower temperature for more factual responses
          max_tokens: 1024
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message && errorData.message.includes('rate limit')) {
          return res.status(429).json({ 
            error: 'Rate limit exceeded', 
            response: 'The AI service is currently experiencing high demand. Please try again in a moment.'
          });
        }
        throw new Error(`GROQ API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      return res.status(200).json({ response: aiResponse });
    } catch (error) {
      console.error('Error processing request:', error);
      return res.status(500).json({ error: 'Failed to process request' });
    }
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}