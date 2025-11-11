import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const { slug, code } = await request.json();

    if (!slug || !code) {
      return NextResponse.json(
        { error: 'Missing slug or code' },
        { status: 400 }
      );
    }

    // Create the directory structure
    const listingsDir = join(process.cwd(), 'app', 'listings', slug);
    
    // Check if directory already exists
    if (existsSync(listingsDir)) {
      return NextResponse.json(
        { error: 'Listing with this slug already exists' },
        { status: 400 }
      );
    }

    // Create directory
    await mkdir(listingsDir, { recursive: true });

    // Write the page.tsx file
    const filePath = join(listingsDir, 'page.tsx');
    await writeFile(filePath, code, 'utf-8');

    return NextResponse.json({
      success: true,
      path: `app/listings/${slug}/page.tsx`,
      slug
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing file' },
      { status: 500 }
    );
  }
}

