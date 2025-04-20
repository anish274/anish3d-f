import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';

import { Badge } from '../../components/Badge';
import { PageLayout } from '../../components/PageLayout';
import { DevelopNote, developApi } from '../../lib/developApi';
import { FeaturedArticles } from '../../components/develop/FeaturedArticles';
import { RegularArticles } from '../../components/develop/RegularArticles';
import { NewsletterSubscribe } from '../../components/develop/NewsletterSubscribe';

const seoTitle = 'Development - Tech Notes regarding building small tools, AI and other stuff';
const seoDescription =
  'Explore my thoughts on programming, building products, AI, and tech leadership. A curated collection of development insights.';

interface Props {
  notes: DevelopNote[];
  tags: Array<string>;
}

export default function Notes({ notes, tags }: Props) {
  // Get featured articles where 'featured' is true
  const featuredArticles = notes.filter(note => note.featured === true);
  const regularArticles = notes.slice();

  return (
    <>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        canonical={`${process.env.NEXT_PUBLIC_URL}/develop`}
        openGraph={{
          images: [{ url: `${process.env.NEXT_PUBLIC_URL}/api/og?title=${seoTitle}` }],
        }}
      />
      <PageLayout
        title="Development - Tech Notes regarding building small tools, AI and other stuff."
        intro="A curated collection of thoughts on programming, building small tools, AI, and tech leadership. Not with expertise, but hopefully useful."
        heroImage="/images/develop-hero.png"
      >
        <div className="relative">
          {/* Show message if no notes found */}
          {notes.length === 0 ? (
            <div className="text-center text-lg text-zinc-500 my-12">No notes found</div>
          ) : (
            <>
              {/* Featured Articles */}
              <FeaturedArticles articles={featuredArticles} />

              {/* Newsletter Section */}
              <NewsletterSubscribe />

              {/* Regular Articles */}
              <RegularArticles articles={regularArticles} />
            </>
          )}

          {/* Tags Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className=""
          >
            <h3 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mt-4 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <motion.div
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge href={`/tags/${tag}`}>
                    #{tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </PageLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const notes = await developApi.getNotes('desc');
    console.log('Fetched notes:', notes); // Add this for debugging
    return {
      props: {
        notes,
        tags: Array.from(new Set(notes.map((post) => post.tags).flat())),
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching notes:', error); // Add this for debugging
    return {
      props: {
        notes: [],
        tags: [],
      },
      revalidate: 10,
    };
  }
};
