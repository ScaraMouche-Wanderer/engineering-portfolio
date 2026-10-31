import { NextResponse } from 'next/server';

export default function proxy() {
  const response = NextResponse.next();

  // 1. Content Security Policy (CSP)
  // This helps prevent XSS and other injection attacks by restricting where scripts can be loaded from.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:;
    worker-src 'self' blob:;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // 2. Strict-Transport-Security (HSTS)
  // Forces the browser to use HTTPS.
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // 3. X-Content-Type-Options
  // Prevents the browser from MIME-sniffing a response away from the declared content-type.
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // 4. X-Frame-Options
  // Prevents clickjacking by forbidding the site from being embedded in an iframe.
  response.headers.set('X-Frame-Options', 'DENY');

  // 5. Referrer-Policy
  // Controls how much referrer information is passed on when navigating away.
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 6. X-XSS-Protection
  // Enables the Cross-site scripting (XSS) filter built into most modern web browsers.
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

// Only apply middleware to relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
