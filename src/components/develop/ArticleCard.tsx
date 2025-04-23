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
  featuredBadgeColor?: string;
  colorTheme?: string; // <-- Add this line
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const ArticleCard = ({
  article,
  index,
  isFeatured = false,
  priority = false,
  featuredBadgeColor = 'bg-primary/80',
  colorTheme, // <-- Add this line
}: ArticleCardProps) => {
  const DEFAULT_THUMBNAIL = '/images/default-thumbnail.jpg';
  // Use min-h for flexibility and remove fixed h-[] on mobile
  const height = isFeatured
    ? 'min-h-[220px] sm:min-h-[350px] md:min-h-[450px]'
    : 'min-h-[180px] sm:min-h-[350px] md:min-h-[450px]';

  const titleSize = isFeatured
    ? 'text-lg sm:text-2xl lg:text-3xl'
    : 'text-base sm:text-xl lg:text-2xl';

  // Define hoverColorClass here, before return
  const hoverColorClass =
    colorTheme === 'blue'
      ? 'group-hover:text-blue-600'
      : 'group-hover:text-primary-light';

  return (
    <article className={`group relative rounded-xl w-full border border-zinc-200 dark:border-zinc-700 ${height}`}>
      {/* Stacked layout for < md */}
      <div className="block md:hidden w-full">
        {article.coverImage ? (
          <div className="relative w-full h-[180px] sm:h-[250px]">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover brightness-90 group-hover:brightness-100 transition duration-300 rounded-t-xl"
              priority={priority}
              quality={isFeatured ? 90 : 85}
              onError={(e) => {
                console.error('Error loading cover image:', article.coverImage);
                e.currentTarget.src = DEFAULT_THUMBNAIL;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-t-xl" />
            {/* Featured Badge for <md */}
            {isFeatured && (
              <div className="absolute top-2 left-2 z-10">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${featuredBadgeColor} backdrop-blur-sm text-white text-xs font-medium`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                  <span>Featured</span>
                </div>
              </div>
            )}
            {/* Tags at top right for <md */}
            <div className="absolute top-2 right-2 z-10">
              <div className="flex flex-wrap gap-1 justify-end">
                {article.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} href={`/tags/${tag}`} className="bg-white/10 hover:bg-white/20 text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-[180px] sm:h-[250px] bg-gray-200 dark:bg-zinc-800 flex items-center justify-center rounded-t-xl" />
        )}
        <div className="w-full bg-zinc-900/80 p-4 rounded-b-xl">
          <Link href={`/${article.slug}`} className="block">
            <h3 className={`${titleSize} font-bold text-white ${hoverColorClass}`}>
              {article.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/60">
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{article.readingTime}</span>
              <span>•</span>
              <span>{article.category}</span>
            </div>
            <p className="mt-1 text-xs text-white/80 line-clamp-2">
              {article.description}
            </p>
          </Link>
        </div>
      </div>
      {/* Overlay layout for md and up */}
      <div className="hidden md:block w-full h-full relative">
        {article.coverImage ? (
          <div className="relative w-full h-[350px] md:h-[450px]">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              sizes="(max-width: 1200px) 50vw, 33vw"
              className="object-cover brightness-90 group-hover:brightness-100 transition duration-300 rounded-xl"
              priority={priority}
              quality={isFeatured ? 90 : 85}
              onError={(e) => {
                console.error('Error loading cover image:', article.coverImage);
                e.currentTarget.src = DEFAULT_THUMBNAIL;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-xl" />
          </div>
        ) : (
          <div className="w-full h-[350px] md:h-[450px] bg-gray-200 dark:bg-zinc-800 flex items-center justify-center rounded-xl" />
        )}
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-4 left-4 z-10">
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${featuredBadgeColor} backdrop-blur-sm text-white text-sm font-medium`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              <span>Featured</span>
            </div>
          </div>
        )}
        {/* Content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10">
          <Link href={`/${article.slug}`} className="block">
            <h3 className={`${titleSize} font-bold text-white group-hover:text-primary-light relative inline-block`}>
              {article.title}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/60">
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{article.readingTime}</span>
              <span>•</span>
              <span>{article.category}</span>
            </div>
            <p className="mt-3 text-base text-white/80 line-clamp-2">
              {article.description}
            </p>
          </Link>
        </div>
        {/* Tags at top right for md and up */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex flex-wrap gap-2 justify-end">
            {article.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} href={`/tags/${tag}`} className="bg-white/10 hover:bg-white/20 text-sm">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};