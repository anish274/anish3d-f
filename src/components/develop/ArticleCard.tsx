import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '../Badge';
import { DevelopNote } from '../../lib/developApi';

interface ArticleCardProps {
  article: DevelopNote;
  index: number;
  isFeatured?: boolean;
  priority?: boolean;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const ArticleCard = ({ article, index, isFeatured = false, priority = false }: ArticleCardProps) => {
  const DEFAULT_THUMBNAIL = '/images/default-thumbnail.jpg';
  const height = isFeatured ? 'h-[450px] sm:h-[550px]' : 'h-[350px] sm:h-[450px]';
  const titleSize = isFeatured ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-lg sm:text-xl lg:text-2xl';

  return (
    <article className={`group relative overflow-hidden rounded-xl ${height}`}>
      <div className="relative h-full overflow-hidden">
        {article.coverImage ? (
          <div className="relative w-full h-full">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105 brightness-50 blur-sm"
              priority={priority}
              quality={isFeatured ? 90 : 85}
              onError={(e) => {
                console.error('Error loading cover image:', article.coverImage);
                e.currentTarget.src = DEFAULT_THUMBNAIL;
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
            <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-primary/80 backdrop-blur-sm text-white text-xs sm:text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              <span>Featured</span>
            </div>
          </div>
        )}
        
        {/* Content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10">
          <Link href={`/develop/${article.slug}`} className="block">
            <h3 className={`${titleSize} font-bold text-white group-hover:text-primary-light relative inline-block`}>
              {article.title}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            </h3>
            <div className="mt-2 sm:mt-3 flex items-center gap-2 text-xs sm:text-sm text-white/60">
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{article.readingTime}</span>
              <span>•</span>
              <span>{article.category}</span>
            </div>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-white/80 line-clamp-2">
              {article.description}
            </p>
          </Link>
        </div>

        {/* Tags at top right */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end">
            {article.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} href={`/tags/${tag}`} className="bg-white/10 hover:bg-white/20 text-xs sm:text-sm">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};