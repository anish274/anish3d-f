import { TextRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { Quote } from '../Quote';

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

//TODO: improve types here, cleanup the code
type Props = {
  block: any;
};

export const NotionBlockRenderer = ({ block }: Props) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <NotionText textItems={value.rich_text} />
        </p>
      );
    case 'heading_1':
      return (
        <h1>
          <NotionText textItems={value.rich_text} />
        </h1>
      );
    case 'heading_2':
      return (
        <h2>
          <NotionText textItems={value.rich_text} />
        </h2>
      );
    case 'heading_3':
      return (
        <h3>
          <NotionText textItems={value.rich_text} />
        </h3>
      );
    case 'bulleted_list':
      return (
        <ul className="list-outside list-disc">
          {value.children?.map((block: any) => (
            <NotionBlockRenderer key={block.id} block={block} />
          ))}
        </ul>
      );
    case 'numbered_list':
      return (
        <ol className="list-outside list-decimal">
          {value.children?.map((block: any) => (
            <NotionBlockRenderer key={block.id} block={block} />
          ))}
        </ol>
      );
    case 'bulleted_list_item':
      // Separate children into sublist items and other blocks
      const bulletChildren = value.children || [];
      const sublistItems = bulletChildren.filter(
        (child: any) => child.type === 'bulleted_list_item'
      );
      const otherChildren = bulletChildren.filter(
        (child: any) => child.type !== 'bulleted_list_item'
      );
      return (
        <li className="list-disc">
          <NotionText textItems={value.rich_text} />
          {/* Render other children (e.g., callouts, paragraphs) */}
          {otherChildren.map((block: any) => (
            <NotionBlockRenderer key={block.id} block={block} />
          ))}
          {/* Render sublist if present */}
          {sublistItems.length > 0 && (
            <ul className="list-circle">
              {sublistItems.map((block: any) => (
                <NotionBlockRenderer key={block.id} block={block} />
              ))}
            </ul>
          )}
        </li>
      );
    case 'numbered_list_item':
      // Separate children into sublist items and other blocks
      const numberedChildren = value.children || [];
      const subNumberedItems = numberedChildren.filter(
        (child: any) => child.type === 'numbered_list_item'
      );
      const otherNumberedChildren = numberedChildren.filter(
        (child: any) => child.type !== 'numbered_list_item'
      );
      return (
        <li className="numbered_list_item">
          <NotionText textItems={value.rich_text} />
          {otherNumberedChildren.map((block: any) => (
            <NotionBlockRenderer key={block.id} block={block} />
          ))}
          {subNumberedItems.length > 0 && (
            <ol className="ml-4 list-decimal">
              {subNumberedItems.map((block: any) => (
                <NotionBlockRenderer key={block.id} block={block} />
              ))}
            </ol>
          )}
        </li>
      );
    case 'to_do':
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />{' '}
            <NotionText textItems={value.rich_text} />
          </label>
        </div>
      );
    case 'toggle':
      return (
        <details>
          <summary>
            <NotionText textItems={value.rich_text} />
          </summary>
          {value.children?.map((block: any) => (
            <NotionBlockRenderer key={block.id} block={block} />
          ))}
        </details>
      );
    case 'child_page':
      return <p>{value.title}</p>;
    case 'image':
      const src = value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[0]?.plain_text : '';
      return (
        <figure>
          <Image
            className="object-cover"
            placeholder="blur"
            src={src}
            alt={caption}
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            width={value.size?.width || 400}
            height={value.size?.height || 300}
          />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    case 'divider':
      return <hr key={id} />;
    case 'quote':
      return <Quote key={id} quote={value.rich_text[0].plain_text} />;
    case 'code':
      return (
        <pre className={`language-${value.language}`}>
          <code key={id}>{value.rich_text[0].plain_text}</code>
        </pre>
      );
    case 'file':
      const src_file = value.type === 'external' ? value.external.url : value.file.url;
      const splitSourceArray = src_file.split('/');
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
      const caption_file = value.caption ? value.caption[0]?.plain_text : '';
      return (
        <figure>
          <div>
            📎{' '}
            <Link href={src_file} passHref>
              {lastElementInArray.split('?')[0]}
            </Link>
          </div>
          {caption_file && <figcaption>{caption_file}</figcaption>}
        </figure>
      );
    case 'bookmark':
      const href = value.url;
      return (
        <div className="my-4 border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow">
          <a href={href} target="_blank" rel="noopener noreferrer" className="block p-4">
            <div className="flex items-center">
              <div className="mr-3 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </div>
              <div className="flex-1 text-blue-600 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                {href}
              </div>
            </div>
          </a>
        </div>
      );
      
    case 'callout':
      return (
        <div className="flex p-4 my-4 bg-gray-100 dark:bg-zinc-800 rounded-md dark:text-zinc-300">
          <div className="mr-4 text-2xl">
            {value.icon?.type === 'emoji' ? value.icon.emoji : '💡'}
          </div>
          <div className="flex-1 [&>h3]:mt-0">
            <div className="mb-2">
              <NotionText textItems={value.rich_text} />
              {/* Render children blocks (including bullet lists) immediately after the main text */}
              {value.children?.map((block: any) => (
                <NotionBlockRenderer key={block.id} block={block} />
              ))}
            </div>
          </div>
        </div>
      );
      
    case 'column_list':
      return (
        <div className="flex flex-col md:flex-row gap-4">
          {value.children?.map((column: any) => (
            <NotionBlockRenderer key={column.id} block={column} />
          ))}
        </div>
      );
    case 'column':
      return (
        <div className="flex-1 border border-gray-200 rounded p-2 min-h-[100px]">
          {value.children && value.children.length > 0 ? (
            value.children.map((child: any) => (
              <NotionBlockRenderer key={child.id} block={child} />
            ))
          ) : (
            <p className="text-gray-400 text-sm">Empty column</p>
          )}
        </div>
      );
      
    default:
      return (
        <>❌ Unsupported block (${type === 'unsupported' ? 'unsupported by Notion API' : type})</>
      );
  }
};

const NotionText = ({ textItems }: { textItems: TextRichTextItemResponse[] }) => {
  if (!textItems) {
    return null;
  }

  return (
    <>
      {textItems.map((textItem) => {
        const {
          annotations: { bold, code, color, italic, strikethrough, underline },
          text,
        } = textItem;
        return (
          <span
            key={text.content}
            className={clsx({
              'font-bold': bold,
              'font-mono font-semibold bg-zinc-600 text-zinc-200 px-1 py-0.5 m-1 rounded-md': code,
              italic: italic,
              'line-through': strikethrough,
              underline: underline,
            })}
            style={color !== 'default' ? { color } : {}}
          >
            {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
          </span>
        );
      })}
    </>
  );
};
