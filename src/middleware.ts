import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, search, hash } = url;
  const hostname = request.headers.get('host') || '';
  
  // Check if we're on the develop subdomain
  const isDevelopSubdomain = hostname.startsWith('develop.');
  
  // Handle static assets on the develop subdomain
  if (isDevelopSubdomain) {
    // For static assets, redirect to main domain
    if (
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/assets/') || 
      pathname.startsWith('/favicon/') ||
      pathname.endsWith('.js') ||
      pathname.endsWith('.css') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.gif')
    ) {
      // Get the domain without subdomain (e.g., anish3d.com)
      const mainDomain = hostname.split('.').slice(1).join('.');
      // Create the main domain URL
      const mainUrl = new URL(pathname, `https://${mainDomain}`);
      mainUrl.search = search;
      mainUrl.hash = hash;
      
      return NextResponse.redirect(mainUrl);
    }
    
    // For regular paths, rewrite to /develop path internally if needed
    if (!pathname.startsWith('/develop') && pathname !== '/') {
      url.pathname = `/develop${pathname}`;
      return NextResponse.rewrite(url);
    }
    
    // For root path or paths already starting with /develop, just pass through
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
    '/_next/:path*',
    '/assets/:path*',
    '/favicon/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
