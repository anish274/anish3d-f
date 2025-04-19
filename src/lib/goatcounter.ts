/**
 * GoatCounter API utilities for fetching page view statistics
 */

interface GoatCounterViewsResponse {
  count: number;
  path: string;
  title: string;
  // Add other fields as needed
}

/**
 * Fetch page views for a specific path from GoatCounter API
 * @param path - The page path to get views for (e.g., '/develop/my-post')
 * @param siteCode - Your GoatCounter site code
 * @returns The number of views or null if there was an error
 */
export async function getPageViews(path: string, siteCode: string = 'anish3d'): Promise<number | null> {
  try {
    // GoatCounter API endpoint for page views
    // Note: You'll need to set up CORS or use a server-side API route for this in production
    const apiUrl = `https://${siteCode}.goatcounter.com/api/v0/count`;
    
    // Add query parameters for filtering by path
    const url = new URL(apiUrl);
    url.searchParams.append('path', path);
    
    // You'll need to add authentication for the API
    // This is a simplified example - in production use an API route with proper auth
    const response = await fetch(url.toString(), {
      headers: {
        // You would add your API key here in a real implementation
        // 'Authorization': 'Bearer YOUR_API_KEY',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch GoatCounter data:', await response.text());
      return null;
    }

    const data = await response.json() as GoatCounterViewsResponse[];
    
    // Sum up all counts for this path
    return data.reduce((total, item) => total + item.count, 0);
  } catch (error) {
    console.error('Error fetching page views:', error);
    return null;
  }
}

/**
 * Format view count for display
 * @param count - The raw view count
 * @returns Formatted string (e.g., "1.2K")
 */
export function formatViewCount(count: number | null): string {
  if (count === null) return '0 Views';
  
  if (count === 0) return '0 Views';
  
  if (count < 1000) {
    return `${count} ${count === 1 ? 'View' : 'Views'}`;
  }
  
  // Format as K for thousands
  if (count < 1000000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K Views`;
  }
  
  // Format as M for millions
  return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M Views`;
}