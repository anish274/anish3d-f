import { GetStaticPaths, GetStaticProps } from 'next';
import { ArticleJsonLd, NextSeo } from 'next-seo';
import Image from 'next/image';
import Prism from 'prismjs';
import { useEffect, useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import { Breadcrumb } from '../../components/Breadcrumb';
import { XIcon } from '../../components/icons/XIcon';
import { DevelopLayout } from '../../components/develop/DevelopLayout';
import { NotionBlockRenderer } from '../../components/notion/NotionBlockRenderer';
import { DevelopNote, developApi } from '../../lib/developApi';

type Props = {
  note: DevelopNote;
  noteContent: any[];
};

export default function Note({
  note: { title, description, createdAt, slug, coverImage, tags },
  noteContent,
  previousPathname,
}: Props & { previousPathname: string }) {
// Calculate reading time (rough estimate)
const text = noteContent.map(block => block.plain_text).join(' ');
const words = text.split(/\s+/).length;
const readingTime = Math.ceil(words / 50); // words per minute, rounded up
  const url = `${process.env.NEXT_PUBLIC_URL}/develop/${slug}`;
  const openGraphImageUrl = coverImage || `${process.env.NEXT_PUBLIC_URL}/api/og?title=${title}&description=${description}`;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [images, setImages] = useState<Array<{ src: string; alt?: string }>>([]);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  // Add click handler for images
  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && !target.closest('.no-popup')) {
        e.preventDefault();
        const clickedSrc = (target as HTMLImageElement).src;
        const clickedAlt = (target as HTMLImageElement).alt || 'Image';
        
        // Collect all images on the page
        const allImages = Array.from(document.querySelectorAll('img:not(.no-popup)'))
          .map((element) => {
            const img = element as HTMLImageElement;
            return {
              src: img.src,
              alt: img.alt || 'Image'
            };
          });
        
        setImages(allImages);
        // Find the index of the clicked image
        const index = allImages.findIndex(img => img.src === clickedSrc);
        setLightboxIndex(index >= 0 ? index : 0);
        setLightboxOpen(true);
      }
    };

    document.addEventListener('click', handleImageClick);
    return () => document.removeEventListener('click', handleImageClick);
  }, []);

  // Add this effect to apply the cursor style to all images
  useEffect(() => {
    const images = document.querySelectorAll('img:not(.no-popup)');
    images.forEach(img => {
      (img as HTMLElement).style.cursor = 'pointer';
    });
    
    return () => {
      // Clean up if needed
    };
  }, [noteContent]);

  // breadcrumbItems constant removed as it's no longer passed to DevelopLayout

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          images: [{ url: openGraphImageUrl }],
        }}
      />
      <ArticleJsonLd
        url={url}
        images={[openGraphImageUrl]}
        title={title}
        datePublished={createdAt}
        authorName="Anish Shah"
        description={description}
      />
      {/* Header and Breadcrumb are now inside DevelopLayout */}

      <DevelopLayout
        title={title}
        coverImage={coverImage}
        publishDate={createdAt} // Pass publish date
        readingTime={readingTime} // Pass reading time
        // breadcrumbItems prop removed
        previousPathname={previousPathname}
        className="max-w-4xl" // ClassName might need adjustment depending on DevelopLayout's internal structure
      >

        <div className="pb-16 w-full">
          {noteContent.map((block) => (
            <NotionBlockRenderer key={block.id} block={block} />
          ))}

          <hr />

          <a
            className="group block text-xl font-semibold md:text-3xl no-underline"
            href={`http://x.com/share?text=${title}&url=${url}`}
          >
            <h4 className="max-w-lg flex cursor-pointer flex-col duration-200 ease-in-out group-hover:text-primary group-hover:fill-primary fill-white text-wrap">
              <XIcon className="my-6 h-10 w-10 transform transition-transform group-hover:-rotate-12 text-black dark:text-white group-hover:text-primary" />
              Click here to share this article with your friends on X if you liked it.
            </h4>
          </a>
        </div>
      </DevelopLayout>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={images}
        index={lightboxIndex}
        plugins={[Zoom]}
        carousel={{ finite: true, preload: 0 }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 1.2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
        }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async (context) => {
  const slug = context.params?.slug;
  const allNotes = await developApi.getNotes();
  const note = allNotes.find((note) => note.slug === slug);

  if (!note) {
    return {
      notFound: true,
    };
  }

  const noteContent = await developApi.getNote(note.id);

  return {
    props: {
      note,
      noteContent,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await developApi.getNotes();

  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: 'blocking',
  };
};
