import { NextSeo } from 'next-seo';

import { PageLayout } from '../components/PageLayout';
import { GetStaticProps } from 'next';
import Error from 'next/error';
import React, { useEffect, useState } from 'react';

const seoTitle = `${'Contact Me - '} ${process.env.NEXT_PUBLIC_FULL_NAME || ''} ${process.env.NEXT_PUBLIC_SITE_DESC || ''}`.trim();
const seoDescription = 'Get in touch with me through this contact form.';

// Move interfaces outside the component
interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormStatus {
  submitted: boolean;
  success: boolean;
  message: string;
}

export default function Contact({ show404 }: { show404: boolean }) {
  // First, declare all hooks at the top level
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<FormStatus>({
    submitted: false,
    success: false,
    message: ''
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  
  // Then handle conditional returns
  if (show404) {
    return <Error statusCode={404} />;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY, // Add this to your .env file
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New contact form submission from ${formData.name}`
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormStatus({
          submitted: true,
          success: true,
          message: 'Thank you! Your message has been received.'
        });
        // Reset form
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus({
          submitted: true,
          success: false,
          message: data.message || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'An error occurred. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        canonical={`${process.env.NEXT_PUBLIC_URL}/contact`}
        openGraph={{
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_URL}/api/og?title=${seoTitle}&description=${seoDescription}`,
            },
          ],
        }}
      />
      <PageLayout
        title="Get in Touch"
        intro="Have a question! Feel free to get in touch. Send me a message!"
      >
        <div className="my-4 border-t border-gray-200 dark:border-neutral-800 " data-testid="breakline"></div>
        <div>
          {formStatus.submitted && (
            <div className={`mb-6 p-4 rounded-md ${formStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {formStatus.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-5 md:flex-row">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-neutral-200 px-3 py-2 focus:outline-none dark:border-neutral-700"
              />
              
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-neutral-200 px-3 py-2 focus:outline-none dark:border-neutral-700"
              />
            </div>
            
            <div>
              <textarea
                id="message"
                name="message"
                placeholder="Message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-neutral-200 px-3 py-2 focus:outline-none dark:border-neutral-700"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </PageLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Check if this page should return 404
  const pagesToHide = process.env.NEXT_PUBLIC_MAKE_PAGE_404?.split(',') || [];
  const show404 = pagesToHide.includes('/contact');
  
  return {
    props: {
      show404,
    },
  };
};
