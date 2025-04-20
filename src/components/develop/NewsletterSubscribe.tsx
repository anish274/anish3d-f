import { motion } from 'framer-motion';

interface NewsletterSubscribeProps {
  title?: string;
  description?: string;
  buttonText?: string;
  inputPlaceholder?: string;
}

export const NewsletterSubscribe = ({
  title = 'Subscribe to Development Related Notes',
  description = 'latest development insights from PM point of view and notes on how PM can experiment with AI and tech!!! Get them delivered to your inbox.',
  buttonText = 'Subscribe',
  inputPlaceholder = 'Enter your email',
}: NewsletterSubscribeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="m-16 md:mb-8 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-4 sm:p-6 md:p-8 dark:from-primary/10 dark:to-primary/20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          {title}
        </h3>
        <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
        <form className="mt-4 sm:mt-6 flex flex-col sm:flex-row max-w-md mx-auto gap-3 sm:gap-4">
          <input
            type="email"
            placeholder={inputPlaceholder}
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 sm:px-4 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {buttonText}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}; 