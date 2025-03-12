import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //const { databaseId } = req.query;
  const databaseId = process.env.NOTION_ABOUT_DATABASE_ID;
  if (!databaseId || typeof databaseId !== 'string') {
    return res.status(400).json({ error: 'Database ID is required' });
  }

  try {
    // Query the database
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    // Transform the response to a simpler format
    const items = response.results.map((page: any) => {
      const properties = page.properties;
      
      return {
        name: properties.Name?.title?.[0]?.plain_text || '',
        directLink: properties['Direct Link']?.url || '',
        linkType: properties['Link Type']?.select?.name || '',
      };
    });

    return res.status(200).json(items);
  } catch (error) {
    console.error('Notion API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch data from Notion' });
  }
}