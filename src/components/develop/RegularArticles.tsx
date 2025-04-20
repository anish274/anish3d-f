import { motion } from 'framer-motion';
import { DevelopNote } from '../../lib/developApi';
import { ArticleCard } from './ArticleCard';

interface RegularArticlesProps {
  articles: DevelopNote[];
}

export const RegularArticles = ({ articles }: RegularArticlesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-12 md:mt-16"
    >
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-6 md:mb-8">
        All Articles
      </h2>
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.slug}
            article={article}
            index={index}
            isFeatured={false}
          />
        ))}
      </div>
    </motion.div>
  );
}; 