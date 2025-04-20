import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  //const pageToMake404 = process.env.NEXT_PUBLIC_MAKE_PAGE_404;
  // const pagesToHide = process.env.NEXT_PUBLIC_MAKE_PAGE_404?.split(',') || [];
  // const show404 = pagesToHide.includes('/creating');
  
  // if (pageToMake404 && request.nextUrl.pathname === pageToMake404) {
  //   return NextResponse.rewrite(new URL('/404', request.url));
  // }

  if (request.nextUrl.pathname.startsWith('/rss.xml')) {
    return NextResponse.rewrite(new URL('/api/rss.xml', request.url));
  }
}
