import type { NextApiRequest, NextApiResponse } from 'next';
import { developApi } from '../../lib/developApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const notes = await developApi.getNotes('desc');
    // logger.info(`Fetched ${notes.length} notes`);
    res.status(200).json({ notes });
  } catch (error) {
    // logger.error({ error }, 'Failed to fetch notes');
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
}