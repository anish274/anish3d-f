import type { NextApiRequest, NextApiResponse } from 'next';
import { developApi } from '../../lib/developApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const notes = await developApi.getNotes('desc');
    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
}