import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const siteCode = process.env.GOAT_SITE_CODE || 'anish3d';
  const apiKey = process.env.GOAT_API_KEY; // Store your GoatCounter API key in .env

  if (!path || typeof path !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid path parameter' });
  }

  const apiUrl = `https://${siteCode}.goatcounter.com/api/v0/count?path=${encodeURIComponent(path)}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
      },
    });

    if (!response.ok) {
      Sentry.captureException(
        new Error(`Failed to fetch GoatCounter data: ${response.status} ${response.statusText}`)
      );
      return res.status(500).json({ error: 'Failed to fetch GoatCounter data' });
    }

    const data = await response.json();

    // Optionally, sum up counts if the response is an array
    let totalViews = 0;
    if (Array.isArray(data)) {
      totalViews = data.reduce((sum, item) => sum + (item.count || 0), 0);
    } else if (typeof data.count === 'number') {
      totalViews = data.count;
    }

    res.status(200).json({ views: totalViews });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error fetching GoatCounter data' });
  }
}