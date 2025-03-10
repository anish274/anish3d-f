import { GetStaticPaths, GetStaticProps } from 'next';
import { ArticleJsonLd, NextSeo } from 'next-seo';
import Prism from 'prismjs';
import { useEffect, useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import { XIcon } from '../../components/icons/XIcon';
import { NoteLayout } from '../../components/notes/NoteLayout';
import { NotionBlockRenderer } from '../../components/notion/NotionBlockRenderer';
import { Note as NoteType, notesApi } from '../../lib/notesApi';

type Props = {
  note: NoteType;
  noteContent: any[];
};

export default function Note({
  note: { title, description, createdAt, slug },
  noteContent,
  previousPathname,
}: Props & { previousPathname: string }) {
  const url = `${process.env.NEXT_PUBLIC_URL}/notes/${slug}`;
  const openGraphImageUrl = `${process.env.NEXT_PUBLIC_URL}/api/og?title=${title}&description=${description}`;
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
          .map((img: HTMLImageElement) => ({
            src: img.src,
            alt: img.alt || 'Image'
          }));
        
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
      img.style.cursor = 'pointer';
    });
    
    return () => {
      // Clean up if needed
    };
  }, [noteContent]);

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
      <NoteLayout
        meta={{ title, description, date: createdAt }}
        previousPathname={previousPathname}
      >
        <div className="pb-32">
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
      </NoteLayout>

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
  const allNotes = await notesApi.getNotes();
  const note = allNotes.find((note) => note.slug === slug);

  if (!note) {
    return {
      notFound: true,
    };
  }

  const noteContent = await notesApi.getNote(note.id);

  return {
    props: {
      note,
      noteContent,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await notesApi.getNotes();

  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: 'blocking',
  };
};
