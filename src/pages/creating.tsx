import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';
import Error from 'next/error';

import { PageLayout } from '../components/PageLayout';
import { ProjectCard } from '../components/ProjectCard';
import { MyCurrentProjects, MyPastProjects } from '../data/lifeApi';
import { ANIMATION_FROM_PROPS, ANIMATION_TO_PROPS } from '../lib/animation';

const seoTitle = 'Creating';
const seoDescription = "Things I've made trying to put my dent in the universe.";

export default function Creating({ show404 }: { show404: boolean }) {
  // Return 404 page if this page should be hidden
  if (show404) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        canonical={`${process.env.NEXT_PUBLIC_URL}/creating`}
        openGraph={{
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_URL}/api/og?title=${seoTitle}&description=${seoDescription}`,
            },
          ],
        }}
      />
      <PageLayout
        title="Things I've made trying to put my dent in the universe."
        intro="A list of projects I've worked on, I'm working on and I will work on."
      >
        <h2 className="text-2xl font-bold tracking-tight">Now</h2>
        <p className="mt-2 text-base">Projects I currently work on.</p>
        <ul
          role="list"
          className="mt-12 grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {MyCurrentProjects.map((project) => (
            <motion.li
              key={project.title}
              initial={ANIMATION_FROM_PROPS}
              whileInView={ANIMATION_TO_PROPS}
              viewport={{ once: true }}
            >
              <ProjectCard project={project} />
            </motion.li>
          ))}
        </ul>

        <h2 className="mt-24 text-2xl font-bold tracking-tight">Past</h2>
        <p className="mt-2 text-base">
          Projects I worked on. Due to nature of internet businesses not all of them are still
          online.
        </p>
        <ul
          role="list"
          className="mt-12 grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {MyPastProjects.map((project) => (
            <motion.li
              key={project.title}
              initial={ANIMATION_FROM_PROPS}
              whileInView={ANIMATION_TO_PROPS}
              viewport={{ once: true }}
            >
              <ProjectCard key={project.title} project={project} />
            </motion.li>
          ))}
        </ul>
      </PageLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Check if this page should return 404
  const pagesToHide = process.env.NEXT_PUBLIC_MAKE_PAGE_404?.split(',') || [];
  const show404 = pagesToHide.includes('/creating');
  
  return {
    props: {
      show404,
    },
  };
};