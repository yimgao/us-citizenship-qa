import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: 'Citizenship Prep',
    short_name: 'Citizenship',
    description: 'Free U.S. naturalization practice',
    start_url: '/en',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#58cc02',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };

  return NextResponse.json(manifest, {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
}
