import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, search, hash } = url;
  const hostname = request.headers.get('host') || '';
  
  // Check if we're on the develop subdomain
  const isDevelopSubdomain = hostname.startsWith('develop.');
  
  // Handle redirection for develop subdomain
  if (isDevelopSubdomain) {
    // If we're on develop.anish3d.com/[slug], no need to change the URL
    // The middleware will pass the request through
    return NextResponse.next();
  } 
  
  // If we're on the main domain and accessing /develop/[slug], redirect to the subdomain
  if (pathname.startsWith('/develop')) {
    // For /develop -> develop.anish3d.com
    if (pathname === '/develop' || pathname === '/develop/') {
      url.pathname = '/';
    } else {
      // For /develop/[slug] -> develop.anish3d.com/[slug]
      url.pathname = pathname.replace('/develop', '');
    }
    
    // Get the domain without subdomain (e.g., anish3d.com)
    const mainDomain = hostname.split('.').slice(-2).join('.');
    url.host = `develop.${mainDomain}`;
    
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Add a matcher for paths that should invoke this middleware
export const config = {
  matcher: [
    '/develop',
    '/develop/:path*',
  ],
};
