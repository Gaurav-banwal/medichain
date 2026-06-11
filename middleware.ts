import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Decodes a base64url-encoded string into a Uint8Array.
 */
function base64urlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Verifies an HMAC SHA-256 (HS256) JWT signature using the Web Crypto API.
 * This runs natively in the Next.js Edge Runtime, bypassing Node-specific dependencies.
 */
async function verifyJWTEdge(token: string, secret: string) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const data = encoder.encode(`${headerB64}.${payloadB64}`);

  // Import signature secret key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const sigBytes = base64urlDecode(signatureB64);
  const isValid = await crypto.subtle.verify(
    'HMAC',
    cryptoKey,
    sigBytes as any,
    data as any
  );

  if (!isValid) {
    throw new Error('Invalid JWT signature');
  }

  // Parse the payload json
  const payloadStr = new TextDecoder().decode(base64urlDecode(payloadB64));
  const payload = JSON.parse(payloadStr);

  // Check expiration time (exp)
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    throw new Error('Token has expired');
  }

  return payload;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // 1. Unauthenticated Request Routing
  if (!token) {
    console.log(`[Middleware] Unauthenticated access to ${pathname}. Redirecting to /login.`);
    const loginUrl = new URL('/login', request.url);
    // Add original path as query param to support post-login redirection if desired
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = process.env.JWT_SECRET || 'medichain-fallback-super-secret-key-969727a7869484baf033fa33d42f766e';
    const decoded = await verifyJWTEdge(token, secret);

    const { role } = decoded;

    // 2. Role-Based Access Control (RBAC) Path Enforcements
    // CITIZEN -> /citizen/*
    if (pathname.startsWith('/citizen') && role !== 'CITIZEN') {
      console.warn(`[Middleware] RBAC violation. User role: ${role} tried to access /citizen. Redirecting.`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // DOCTOR -> /doctor/*
    if (pathname.startsWith('/doctor') && role !== 'DOCTOR') {
      console.warn(`[Middleware] RBAC violation. User role: ${role} tried to access /doctor. Redirecting.`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // PHARMACY -> /pharmacy/*
    if (pathname.startsWith('/pharmacy') && role !== 'PHARMACY') {
      console.warn(`[Middleware] RBAC violation. User role: ${role} tried to access /pharmacy. Redirecting.`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // REGULATOR -> /regulator/*
    if (pathname.startsWith('/regulator') && role !== 'REGULATOR') {
      console.warn(`[Middleware] RBAC violation. User role: ${role} tried to access /regulator. Redirecting.`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Allow authenticated request to proceed
    return NextResponse.next();
  } catch (error: any) {
    console.error(`[Middleware] Token verification failed: ${error.message}. Redirecting to /login.`);
    
    // Clear invalid/expired cookie and redirect
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

// Protect all paths matching citizen, doctor, pharmacy, regulator
export const config = {
  matcher: [
    '/citizen/:path*',
    '/doctor/:path*',
    '/pharmacy/:path*',
    '/regulator/:path*',
  ],
};
