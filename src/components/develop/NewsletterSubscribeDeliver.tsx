import { motion } from 'framer-motion';

interface NewsletterSubscribeProps {
  title?: string;
  description?: string;
  buttonText?: string;
  inputPlaceholder?: string;
}

export const NewsletterSubscribeDeliver = ({
  title = 'Subscribe to Project Management / Delivery Related Notes',
  description = 'latest PM insights and notes on how PM can experiment with agile methodologies and new programs!!! Get them delivered to your inbox.',
  buttonText = 'Subscribe',
  inputPlaceholder = 'Enter your email',
}: NewsletterSubscribeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="
        m-3
        sm:m-6
        md:m-8
        lg:m-16
        mb-3
        md:mb-6
        rounded-2xl
        bg-gradient-to-br from-blue-100/60 to-blue-200/60
        p-2
        sm:p-3
        md:p-5
        lg:p-8
        dark:from-blue-900/30 dark:to-blue-800/40
      "
    >
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="
          text-base
          sm:text-lg
          md:text-xl
          lg:text-2xl
          font-bold tracking-tight
          text-zinc-800 dark:text-zinc-100
        ">
          {title}
        </h3>
        <p className="
          mt-1
          sm:mt-2
          text-xs
          sm:text-sm
          md:text-base
          text-zinc-600 dark:text-zinc-400
        ">
          {description}
        </p>
        <form className="
          mt-2
          sm:mt-3
          flex flex-col
          sm:flex-row
          max-w-md mx-auto
          gap-2
          sm:gap-3
        ">
          <input
            type="email"
            placeholder={inputPlaceholder}
            className="
              flex-1
              rounded-lg
              border border-blue-200
              bg-white
              px-2
              sm:px-3
              md:px-4
              py-1
              sm:py-2
              text-xs
              sm:text-sm
              text-zinc-900 placeholder-zinc-500
              focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300
              dark:border-blue-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400
            "
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              rounded-lg
              bg-blue-600
              px-3
              sm:px-4
              py-1
              sm:py-2
              text-xs
              sm:text-sm
              font-medium
              text-white
              hover:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-blue-300
            "
          >
            {buttonText}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};