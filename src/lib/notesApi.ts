// @ts-nocheck
import { Client, isFullPage } from '@notionhq/client';
import { BlockObjectResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { compareAsc, compareDesc } from 'date-fns';
import { getPlaiceholder } from 'plaiceholder';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export type Note = {
  id: string;
  createdAt: string;
  lastEditedAt: string;
  coverImage: string | null;
  thumbnail?: string;
  tags: string[];
  title: string;
  description: string;
  slug: string;
  isPublished: boolean;
  publishedAt: string;
  inProgress: boolean;
  isProd: boolean;
  category?: string;
};

const noop = async (block: BlockObjectResponse) => block;

/**
 * Union type of all block types
 * @see https://developers.notion.com/reference/block
 */
type BlockType = BlockObjectResponse['type'];

/**
 * Lookup table for transforming block types
 * Allows to transform an api response for a specific block type into a more usable format
 */
const BlockTypeTransformLookup: Record<
  BlockType,
  (block: BlockObjectResponse) => Promise<BlockObjectResponse>
> = {
  file: noop,
  paragraph: noop,
  heading_1: noop,
  heading_2: noop,
  heading_3: noop,
  bulleted_list_item: noop,
  numbered_list_item: noop,
  quote: noop,
  to_do: noop,
  toggle: noop,
  template: noop,
  synced_block: noop,
  child_page: noop,
  child_database: noop,
  equation: noop,
  code: noop,
  callout: noop,
  divider: noop,
  breadcrumb: noop,
  table_of_contents: noop,
  column_list: noop,
  column: noop,
  link_to_page: noop,
  table: noop,
  table_row: noop,
  embed: noop,
  bookmark: noop,
  image: async (block: any) => {
    const contents = block[block.type];
    const buffer = await fetch(contents[contents.type].url).then(async (res) =>
      Buffer.from(await res.arrayBuffer()),
    );
    const {
      base64,
      metadata: { height, width },
    } = await getPlaiceholder(buffer, { size: 64 });
    block.image['size'] = { height, width };
    block.image['placeholder'] = base64;

    return block;
  },
  video: noop,
  pdf: noop,
  audio: noop,
  link_preview: noop,
  unsupported: noop,
};

const CompareFunctionLookup = {
  asc: compareAsc,
  desc: compareDesc,
};

class NotesApi {
  constructor(
    private readonly notion: Client,
    private readonly databaseId: string,
  ) {}

  async getNotes(sortOrder: 'asc' | 'desc' = 'desc', limit?: number) {
    const notes = await this.getDatabaseContent(this.databaseId);

    return notes
      .sort((a, b) => {
        return CompareFunctionLookup[sortOrder](new Date(a.publishedAt), new Date(b.publishedAt));
      })
      .slice(0, limit);
  }

  async getNotesByTag(tag: string, sortOrder: 'asc' | 'desc' = 'desc', limit?: number) {
    const notes = await notesApi.getNotes(sortOrder, limit);
    const relatedNotes = notes.filter((post) => post.tags.includes(tag));

    return relatedNotes;
  }

  async getNote(id: string) {
    return this.getPageContent(id);
  }

  async getAllTags() {
    const posts = await notesApi.getNotes();

    return Array.from(new Set(posts.map((note) => note.tags).flat()));
  }

  private getDatabaseContent = async (databaseId: string): Promise<Note[]> => {
    const db = await this.notion.databases.query({ database_id: databaseId });

    while (db.has_more && db.next_cursor) {
      const { results, has_more, next_cursor } = await this.notion.databases.query({
        database_id: databaseId,
        start_cursor: db.next_cursor,
      });
      db.results = [...db.results, ...results];
      db.has_more = has_more;
      db.next_cursor = next_cursor;
    }

    return db.results
      .map((page) => {
        if (!isFullPage(page)) {
          throw new Error('Notion page is not a full page');
        }

        return {
          id: page.id,
          createdAt: page.created_time,
          lastEditedAt: page.last_edited_time,
          coverImage: page.cover?.type === 'external' ? page.cover.external.url : null,
          tags:
            'multi_select' in page.properties.hashtags
              ? page.properties.hashtags.multi_select.map((tag) => tag.name)
              : [],
          title: 'title' in page.properties.title ? page.properties.title.title[0].plain_text : '',
          description:
            'rich_text' in page.properties.description
              ? page.properties.description.rich_text[0].plain_text
              : '',
          slug:
            'rich_text' in page.properties.slug ? page.properties.slug.rich_text[0].plain_text : '',
          isPublished:
            'checkbox' in page.properties.published ? page.properties.published.checkbox : false,
          publishedAt:
            page.properties.publishedAt && 'date' in page.properties.publishedAt ? page.properties.publishedAt.date?.start : '',
          inProgress:
            'checkbox' in page.properties.inProgress ? page.properties.inProgress.checkbox : false,
          isProd:
            'checkbox' in page.properties.isProd ? page.properties.isProd.checkbox : false,
          category:
            'select' in page.properties.category? page.properties.category.select?.name : '',
        };
      })
      .filter((post) => post.isPublished && (process.env.NODE_ENV !== 'production' || post.isProd));
      //.filter((post) => post.isPublished);
  };
  private getPageContent = async (pageId: string) => {
      const blocks = await this.getBlocks(pageId);
  
      const blocksChildren = await Promise.all(
        blocks.map(async (block) => {
          const { id } = block;
          const contents = block[block.type as keyof typeof block] as any;
          if (!['unsupported', 'child_page'].includes(block.type) && block.has_children) {
            const childBlocks = await this.getBlocks(id);
            
            // For column_list and column blocks, recursively fetch their children
            if (block.type === 'column_list' || block.type === 'column') {
              const processedChildBlocks = await Promise.all(
                childBlocks.map(async (childBlock) => {
                  if (childBlock.has_children) {
                    const childContents = childBlock[childBlock.type as keyof typeof childBlock] as any;
                    childContents.children = await this.getBlocks(childBlock.id);
                  }
                  return childBlock;
                })
              );
              contents.children = processedChildBlocks;
            } else {
              contents.children = childBlocks;
            }
          }
  
          return block;
        }),
      );
  
      return Promise.all(
        blocksChildren.map(async (block) => {
          return BlockTypeTransformLookup[block.type as BlockType](block);
        }),
      ).then((blocks) => {
        return blocks.reduce((acc: any, curr) => {
          if (curr.type === 'bulleted_list_item') {
            if (acc[acc.length - 1]?.type === 'bulleted_list') {
              acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
            } else {
              acc.push({
                type: 'bulleted_list',
                bulleted_list: { children: [curr] },
              });
            }
          } else if (curr.type === 'numbered_list_item') {
            if (acc[acc.length - 1]?.type === 'numbered_list') {
              acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
            } else {
              acc.push({
                type: 'numbered_list',
                numbered_list: { children: [curr] },
              });
            }
          } else {
            acc.push(curr);
          }
          return acc;
        }, []);
      });
    };
  private getBlocks = async (blockId: string) => {
    const list = await this.notion.blocks.children.list({
      block_id: blockId,
    });
  
    while (list.has_more && list.next_cursor) {
      const { results, has_more, next_cursor } = await this.notion.blocks.children.list({
        block_id: blockId,
        start_cursor: list.next_cursor,
      });
      list.results = list.results.concat(results);
      list.has_more = has_more;
      list.next_cursor = next_cursor;
    }
  
    // Process blocks to handle column_list and column blocks
    const blocks = list.results as BlockObjectResponse[];
    
    return blocks;
  };
}

export const notesApi = new NotesApi(notion, process.env.NOTION_DATABASE_ID!);
