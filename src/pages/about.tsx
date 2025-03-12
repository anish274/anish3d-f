import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { GetStaticProps } from 'next';
import AvatarImage from '../../public/assets/blog/authors/anish_profile_about.png';
import { Container } from '../components/Container';
import { ExternalLink } from '../components/ExternalLink';
import { PageTitle } from '../components/PageTitle';
import { Quote } from '../components/Quote';
import { Section } from '../components/Section';
import { SocialLink } from '../components/SocialLink';
import {
  AboutExtended,
  AboutWork,
  Blogs,
  Books,
  PeopleWorthFollowingOnTwitter,
  Podcasts,
  Quotes,
  SocialMedia,
  VideosWorthWatching
} from '../data/lifeApi';

import { useAboutMeData } from '../hooks/useAboutMeData';

const seoTitle = `${'About Me - '} ${process.env.NEXT_PUBLIC_FULL_NAME || ''} ${process.env.NEXT_PUBLIC_SITE_DESC || ''}`.trim();
const seoDescription = process.env.NEXT_PUBLIC_HOME_PAGE_SEO_DESC;
// const seoTitle = `About`;
// const seoDescription = `A few words about me.`;

export const getStaticProps: GetStaticProps = async () => {
  // Check if this page should return 404
  const pagesToHide = process.env.NEXT_PUBLIC_MAKE_PAGE_404?.split(',') || [];
  const show404 = pagesToHide.includes('/about');
  
  return {
    props: {
      show404,
    },
  };
};

export default function AboutMe() {
  const randomQuote = useMemo(() => Quotes[Math.floor(Math.random() * Quotes.length)], []);
  const { notionData, loading, error } = useAboutMeData();
  return (
    <>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        canonical={`${process.env.NEXT_PUBLIC_URL}/about`}
        openGraph={{
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_URL}/api/og?title=${seoTitle}&description=${seoDescription}`,
            },
          ],
        }}
      />
      <Container className="mt-16 sm:mt-32">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none">
              <Image
                src={AvatarImage}
                alt=""
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="lg:order-first lg:row-span-2">
            <PageTitle>Hi, I&apos;m Anish Shah.</PageTitle>
            <div className="mt-6 text-base">{AboutExtended}</div>
            <div className="mt-6 flex gap-6">
              {SocialMedia.map((socialProfile) => (
                <SocialLink
                  target='_blank'
                  key={socialProfile.name}
                  aria-label={`Follow on ${socialProfile.name}`}
                  href={socialProfile.link}
                  icon={socialProfile.icon}
                />
              ))}
            </div>

            <Section>
              <Section.Title as="h2">Work</Section.Title>
              <Section.Content>
              {AboutWork}
                <br />
                <br />
                <ExternalLink href="mailto:anish@outlook.in">email me.</ExternalLink>
              </Section.Content>
            </Section>
            <Section>
              <Section.Title as="h2">Books worth re-reading</Section.Title>
              <Section.Content>
                <ul className="mt-1 list-disc list-inside">
                   {notionData.books_collection.map((book, index) => (
                    <li key={index}>
                      <a href={book.link} target="_blank" rel="noopener noreferrer">
                        {book.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </Section.Content>
            </Section>
            <Section>
              <Section.Title as="h2">Podcasts I listen to</Section.Title>
              <Section.Content>
                <ul className="mt-1 list-disc list-inside">
                  {notionData.podcasts_collection.map((pc, index) => (
                    <li key={index}>
                      <a href={pc.link} target="_blank" rel="noopener noreferrer">
                        {pc.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </Section.Content>
            </Section>
            <Section>
              <Section.Title as="h2">Blogs I read</Section.Title>
              <Section.Content>
                <ul className="mt-1 list-disc list-inside">
                  {notionData.blogs_collection.map((blog, index) => (
                    <li key={index}>
                      <a href={blog.link} target="_blank" rel="noopener noreferrer">
                        {blog.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </Section.Content>
            </Section>
            <Section>
              <Section.Title as="h2">Videos worth watching</Section.Title>
              <Section.Content>
                <ul className="mt-1 list-disc list-inside">
                  {notionData.videos_collection.map((vid, index) => (
                    <li key={index}>
                      <a href={vid.link} target="_blank" rel="noopener noreferrer">
                        {vid.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </Section.Content>
            </Section>
            <Section>
              <Section.Title as="h2">People with unique perspective I follow</Section.Title>
              <Section.Content>
                {notionData.people_collection.map((p, index) => (
                    <li key={index}>
                      <a href={p.link} target="_blank" rel="noopener noreferrer">
                        {p.name}
                      </a>
                    </li>
                  ))}
              </Section.Content>
            </Section>
            <Section>
              <Section.Title as="h2">Quote worth thinking about</Section.Title>
              <Section.Content>
                <div className="mt-8">
                  <Quote quote={randomQuote.content} author={randomQuote.author} />
                </div>
              </Section.Content>
            </Section>
          </div>
        </div>
      </Container>
    </>
  );
}
