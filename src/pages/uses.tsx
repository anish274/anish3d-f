import { NextSeo } from 'next-seo';

import { PageLayout } from '../components/PageLayout';
import { Tool } from '../components/tools/Tool';
import { ToolsSection } from '../components/tools/ToolsSection';
import { Tools } from '../data/lifeApi';
import { GetStaticProps } from 'next';
import Error from 'next/error';
import { useEffect, useState } from 'react';

const seoTitle = 'Uses';
const seoDescription = 'Software I use, gadgets I love, and other things I recommend.';

export default function Uses({ show404 }: { show404: boolean }) {
  // Return 404 page if this page should be hidden
  if (show404) {
    return <Error statusCode={404} />;
  }
  
  // Rest of the component remains unchanged
  return (
    <>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        canonical={`${process.env.NEXT_PUBLIC_URL}/uses`}
        openGraph={{
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_URL}/api/og?title=${seoTitle}&description=${seoDescription}`,
            },
          ],
        }}
      />
      <PageLayout
        title="Software I use, gadgets I love, and other things I recommend."
        intro="Here's a big list of all of my favorite stuff."
      >
        <div className="space-y-20">
          {Object.entries(Tools).map(([title, tools]) => (
            <ToolsSection key={title} title={title}>
              {tools.map((tool) => (
                <Tool key={tool.title} title={tool.title} href={tool.href}>
                  {tool.description}
                </Tool>
              ))}
            </ToolsSection>
          ))}
        </div>
      </PageLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Check if this page should return 404
  const pagesToHide = process.env.NEXT_PUBLIC_MAKE_PAGE_404?.split(',') || [];
  const show404 = pagesToHide.includes('/uses');
  
  return {
    props: {
      show404,
    },
  };
};
