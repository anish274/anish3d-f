import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';

import { Badge } from '../../components/Badge';
import { PageLayout } from '../../components/PageLayout';
import { DevelopNote, developApi } from '../../lib/developApi';
import { FeaturedArticles } from '../../components/develop/FeaturedArticles';
import { RegularArticles } from '../../components/develop/RegularArticles';
import { NewsletterSubscribe } from '../../components/develop/NewsletterSubscribe';

const seoTitle = 'Deliver/Direction - PM or other Notes regarding empowering team, small talks on business and product management';
const seoDescription =
  'Explore my thoughts on programming, building products, AI, and tech leadership. A curated collection of development insights.';

interface Props {
  notes: DevelopNote[];
  tags: Array<string>;
  newsletterTitle: string;
  newsletterDesc: string;
  newsletterListId: string;
}

export default function Notes({ notes, tags, newsletterTitle, newsletterDesc, newsletterListId }: Props) {
  // Filter notes for category "deliver"
  const deliverNotes = notes.filter(note => note.category === "deliver");
  const featuredArticles = deliverNotes.filter(note => note.featured === true);
  const regularArticles = deliverNotes.slice();

  return (
    <>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        canonical={`${process.env.NEXT_PUBLIC_URL}/deliver`}
        openGraph={{
          images: [{ url: `${process.env.NEXT_PUBLIC_URL}/api/og?title=${seoTitle}` }],
        }}
      />
      <PageLayout
        title="Delivery / Directing Project - Notes on product management, business and team."
        intro="A curated collection of thoughts on product/project management, relevant Certifications, team leadership and PM tools."
        heroImage="/images/deliver-hero.jpg"
        heroImageClassName="filter blur-sm"
      >
        <div className="relative mx-2 sm:mx-8">
          {/* Show message if no notes found */}
          {notes.length === 0 ? (
            <div className="text-center text-lg text-zinc-500 my-12">No notes found</div>
          ) : (
            <>
              {/* Featured Articles */}
              <FeaturedArticles articles={featuredArticles} featuredBadgeColor="bg-blue-600" colorTheme="blue" />

              {/* Newsletter Section */}
              <NewsletterSubscribe
                colorTheme="blue"
                title={newsletterTitle}
                description={newsletterDesc}
                listId={newsletterListId}
              />

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
    return {
      props: {
        notes,
        tags: Array.from(new Set(notes.map((post) => post.tags).flat())),
        newsletterTitle: process.env.NEWSLETTER_DELIVER_TITLE || '',
        newsletterDesc: process.env.NEWSLETTER_DELIVER_DESC || '',
        newsletterListId: process.env.NEWSLETTER_DELIVER_LIST_ID || '',
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching notes:', error); // Add this for debugging
    return {
      props: {
        notes: [],
        tags: [],
        newsletterTitle: '',
        newsletterDesc: '',
        newsletterListId: '',
      },
      revalidate: 10,
    };
  }
};
