import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, search, hash } = url;
  const hostname = request.headers.get('host') || '';
  
  // Check if we're on the develop subdomain
  const isDevelopSubdomain = hostname.startsWith('develop.');
  
  // Handle redirection for develop subdomain
  if (isDevelopSubdomain) {
    // Check if we're requesting a static asset that should come from the main domain
    if (
      pathname.startsWith('/favicon') || 
      pathname.startsWith('/assets') ||
      pathname.startsWith('/_next/static')
    ) {
      // Allow these to pass through - they'll be handled by the main domain
      return NextResponse.next();
    }
    
    // Handle other paths on the develop subdomain
    const url = request.nextUrl.clone();
    // Rewrite the internal path to include /develop
    if (!pathname.startsWith('/develop') && pathname !== '/') {
      url.pathname = `/develop${pathname}`;
      return NextResponse.rewrite(url);
    }
    
    // If it's the root path or already has /develop, just pass through
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
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
