import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle RSS rewrite
  if (request.nextUrl.pathname.startsWith('/rss.xml')) {
    return NextResponse.rewrite(new URL('/api/rss.xml', request.url));
  }

  // Handle develop subdomain routing
  const hostname = request.headers.get('host');
  const isDevelopSubdomain = hostname?.startsWith('develop.');
  
  // If accessing from develop subdomain, rewrite to /develop path
  if (isDevelopSubdomain) {
    const url = request.nextUrl.clone();
    // Don't add /develop if the path already starts with it
    if (!url.pathname.startsWith('/develop')) {
      url.pathname = `/develop${url.pathname}`;
    }
    return NextResponse.rewrite(url);
  }
  
  // If accessing /develop path directly, redirect to subdomain
  if (request.nextUrl.pathname.startsWith('/develop')) {
    const mainDomain = hostname?.replace('www.', '');
    const url = request.nextUrl.clone();
    // Keep the rest of the path after /develop
    url.pathname = url.pathname.replace(/^\/develop/, '') || '/';
    url.host = `develop.${mainDomain}`;
    return NextResponse.redirect(url);
  }
}
