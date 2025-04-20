import { Client, isFullPage } from '@notionhq/client';
import { BlockObjectResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { compareAsc, compareDesc } from 'date-fns';
import { getPlaiceholder } from 'plaiceholder';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export type DevelopNote = {
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
  readingTime?: string;
  featured?: boolean;
};

const noop = async (block: BlockObjectResponse) => block;

type BlockType = BlockObjectResponse['type'];

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

class DevelopApi {
  constructor(
    private readonly notion: Client,
    private readonly databaseId: string,
  ) {
    // logger.info('DevelopApi initialized with databaseId: %s', databaseId);
  }

  async getNotes(sortOrder: 'asc' | 'desc' = 'desc', limit?: number) {
    // logger.info('Fetching notes with sortOrder=%s, limit=%s', sortOrder, limit);
    const notes = await this.getDatabaseContent();
    // logger.info('Fetched %d notes from database', notes.length);

    return notes
      .sort((a, b) => {
        return CompareFunctionLookup[sortOrder](new Date(a.publishedAt), new Date(b.publishedAt));
      })
      .slice(0, limit);
  }

  async getFeaturedNotes(limit: number = 3) {
    // logger.info('Fetching featured notes, limit=%d', limit);
    const notes = await this.getDatabaseContent();
    const featured = notes.filter(note => note.featured);
    // logger.info('Found %d featured notes', featured.length);
    return featured
      .sort((a, b) => CompareFunctionLookup.desc(new Date(a.publishedAt), new Date(b.publishedAt)))
      .slice(0, limit);
  }

  async getNotesByCategory(category: string, sortOrder: 'asc' | 'desc' = 'desc', limit?: number) {
    // logger.info('Fetching notes by category: %s', category);
    const notes = await this.getNotes(sortOrder, limit);
    const filtered = notes.filter((note) => note.category === category);
    // logger.info('Found %d notes in category %s', filtered.length, category);
    return filtered;
  }

  async getNotesByTag(tag: string, sortOrder: 'asc' | 'desc' = 'desc', limit?: number) {
    // logger.info('Fetching notes by tag: %s', tag);
    const notes = await this.getNotes(sortOrder, limit);
    const filtered = notes.filter((note) => note.tags.includes(tag));
    // logger.info('Found %d notes with tag %s', filtered.length, tag);
    return filtered;
  }

  async getNote(id: string) {
    // logger.info('Fetching note with id: %s', id);
    return this.getPageContent(id);
  }

  async getAllTags() {
    // logger.info('Fetching all tags');
    const notes = await this.getNotes();
    const tags = Array.from(new Set(notes.map((note) => note.tags).flat()));
    // logger.info('Found %d unique tags', tags.length);
    return tags;
  }

  async getAllCategories() {
    // logger.info('Fetching all categories');
    const notes = await this.getNotes();
    const categories = Array.from(new Set(notes.map((note) => note.category)));
    // logger.info('Found %d unique categories', categories.length);
    return categories;
  }

  // Change from private to public
  public async getDatabaseContent() {
    // logger.info('Querying Notion database: %s', this.databaseId);
    const db = await this.notion.databases.query({ database_id: this.databaseId });

    while (db.has_more && db.next_cursor) {
      // logger.info('Fetching more results from Notion database...');
      const { results, has_more, next_cursor } = await this.notion.databases.query({
        database_id: this.databaseId,
        start_cursor: db.next_cursor,
      });
      db.results = [...db.results, ...results];
      db.has_more = has_more;
      db.next_cursor = next_cursor;
    }

    // logger.info('Mapping %d pages from Notion database', db.results.length);

    return db.results
      .map((page) => {
        if (!isFullPage(page)) {
          // logger.error('Notion page is not a full page: %o', page);
          throw new Error('Notion page is not a full page');
        }

        // Handle cover image from Files & Media property
        let coverImage = null;
        if (
          page.properties.cover &&
          typeof page.properties.cover === 'object' &&
          'files' in page.properties.cover &&
          Array.isArray(page.properties.cover.files) &&
          page.properties.cover.files.length > 0
        ) {
          const file = page.properties.cover.files[0];
          if (file.type === 'external') {
            coverImage = file.external.url;
          } else if (file.type === 'file') {
            coverImage = file.file.url;
          }
        }

        return {
          id: page.id,
          createdAt: page.created_time,
          lastEditedAt: page.last_edited_time,
          coverImage,
          tags:
            page.properties.hashtags &&
            typeof page.properties.hashtags === 'object' &&
            'multi_select' in page.properties.hashtags &&
            Array.isArray(page.properties.hashtags.multi_select)
              ? page.properties.hashtags.multi_select.map((tag) => tag.name)
              : [],
          title:
            page.properties.title &&
            typeof page.properties.title === 'object' &&
            'title' in page.properties.title &&
            Array.isArray(page.properties.title.title) &&
            page.properties.title.title.length > 0 &&
            page.properties.title.title[0] &&
            'plain_text' in page.properties.title.title[0]
              ? page.properties.title.title[0].plain_text
              : '',
          description:
            page.properties.description &&
            typeof page.properties.description === 'object' &&
            'rich_text' in page.properties.description &&
            Array.isArray(page.properties.description.rich_text) &&
            page.properties.description.rich_text.length > 0 &&
            page.properties.description.rich_text[0] &&
            'plain_text' in page.properties.description.rich_text[0]
              ? page.properties.description.rich_text[0].plain_text
              : '',
          slug:
            page.properties.slug &&
            typeof page.properties.slug === 'object' &&
            'rich_text' in page.properties.slug &&
            Array.isArray(page.properties.slug.rich_text) &&
            page.properties.slug.rich_text.length > 0 &&
            page.properties.slug.rich_text[0] &&
            'plain_text' in page.properties.slug.rich_text[0]
              ? page.properties.slug.rich_text[0].plain_text
              : '',
          isPublished:
            page.properties.published &&
            typeof page.properties.published === 'object' &&
            'checkbox' in page.properties.published
              ? page.properties.published.checkbox
              : false,
          publishedAt:
            page.properties.publishedAt &&
            typeof page.properties.publishedAt === 'object' &&
            'date' in page.properties.publishedAt &&
            page.properties.publishedAt.date &&
            'start' in page.properties.publishedAt.date
              ? page.properties.publishedAt.date.start
              : '',
          inProgress:
            page.properties.inProgress &&
            typeof page.properties.inProgress === 'object' &&
            'checkbox' in page.properties.inProgress
              ? page.properties.inProgress.checkbox
              : false,
          isProd:
            page.properties.isProd &&
            typeof page.properties.isProd === 'object' &&
            'checkbox' in page.properties.isProd
              ? page.properties.isProd.checkbox
              : false,
          category:
            page.properties.category &&
            typeof page.properties.category === 'object' &&
            'select' in page.properties.category &&
            page.properties.category.select &&
            'name' in page.properties.category.select
              ? page.properties.category.select.name || 'Uncategorized'
              : 'Uncategorized',
          readingTime:
            page.properties.readingTime &&
            typeof page.properties.readingTime === 'object' &&
            'rich_text' in page.properties.readingTime &&
            Array.isArray(page.properties.readingTime.rich_text) &&
            page.properties.readingTime.rich_text.length > 0 &&
            page.properties.readingTime.rich_text[0] &&
            'plain_text' in page.properties.readingTime.rich_text[0]
              ? page.properties.readingTime.rich_text[0].plain_text
              : '5 min read',
          featured:
            page.properties.featured &&
            typeof page.properties.featured === 'object' &&
            'checkbox' in page.properties.featured
              ? page.properties.featured.checkbox
              : false,
        };
      })
      .filter((note) => {
        // logger.info(`NODE_ENV::: ${process.env.NODE_ENV}`);
        return (
          note.isPublished &&
          (!['development', 'production', 'preview'].includes(process.env.NODE_ENV ?? '') || note.isProd)
        );
      });
  }

  private getPageContent = async (pageId: string) => {
    // logger.info('Fetching page content for pageId: %s', pageId);
    const blocks = await this.getBlocks(pageId);

    const blocksChildren = await Promise.all(
      blocks.map(async (block) => {
        const { id } = block;
        const contents = block[block.type as keyof typeof block] as any;
        if (!['unsupported', 'child_page'].includes(block.type) && block.has_children) {
          // logger.info('Fetching child blocks for blockId: %s', id);
          const childBlocks = await this.getBlocks(id);

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
      // logger.info('Processed %d blocks for pageId: %s', blocks.length, pageId);
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
    // logger.info('Fetching blocks for blockId: %s', blockId);
    const list = await this.notion.blocks.children.list({
      block_id: blockId,
    });

    while (list.has_more && list.next_cursor) {
      // logger.info('Fetching more child blocks for blockId: %s', blockId);
      const { results, has_more, next_cursor } = await this.notion.blocks.children.list({
        block_id: blockId,
        start_cursor: list.next_cursor,
      });
      list.results = list.results.concat(results);
      list.has_more = has_more;
      list.next_cursor = next_cursor;
    }

    // logger.info('Fetched %d blocks for blockId: %s', list.results.length, blockId);
    return list.results as BlockObjectResponse[];
  };
}

export const developApi = new DevelopApi(notion, process.env.NOTION_DEVELOP_DATABASE_ID!);