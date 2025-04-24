import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface NewsletterSubscribeProps {
  title?: string;
  description?: string;
  buttonText?: string;
  inputPlaceholder?: string;
  colorTheme?: string; // new
  listId?: string | number; // new
}

export const NewsletterSubscribe = ({
  title = 'Subscribe to Development Related Notes',
  description = 'latest development insights from PM point of view and notes on how PM can experiment with AI and tech!!! Get them delivered to your inbox.',
  buttonText = 'Subscribe',
  inputPlaceholder = 'Enter your email',
  colorTheme = 'primary', // new
  listId = 5, // new, fallback to 5
}: NewsletterSubscribeProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<React.ReactNode>(''); // <-- update type here

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (process.env.NEXT_PUBLIC_BREVO_API_KEY) {
        headers['api-key'] = process.env.NEXT_PUBLIC_BREVO_API_KEY;
      }
      const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          listIds: [Number(listId)],
          updateEnabled: true,
        }),
      });

      let data: any = {};
      const text = await res.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (jsonErr) {
          data = {};
        }
      }

      if (res.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        // Check for already existing email error
        if (
          (data.code === 'duplicate_parameter' || data.message?.toLowerCase().includes('already exists'))
        ) {
          setStatus('error');
          setMessage(
            <>
              This email is already subscribed.{' '}
              <a
                href="https://www.brevo.com/contacts/preferences"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                Update your preferences
              </a>
              .
            </>
          );
        } else {
          setStatus('error');
          setMessage(data.message || data.code || 'Subscription failed. Please try again.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage('An error occurred. Please try again...');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`m-16 md:mb-8 rounded-2xl bg-gradient-to-br from-${colorTheme}/5 to-${colorTheme}/10 p-4 sm:p-6 md:p-8 dark:from-${colorTheme}/10 dark:to-${colorTheme}/20`}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          {title}
        </h3>
        <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
        <form
          className="mt-4 sm:mt-6 flex flex-col sm:flex-row max-w-md mx-auto gap-3 sm:gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder={inputPlaceholder}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 sm:px-4 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Subscribing...' : buttonText}
          </motion.button>
        </form>
        {message && (
          <p className={`mt-2 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </motion.div>
  );
};