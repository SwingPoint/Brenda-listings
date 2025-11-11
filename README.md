# Property Listings Manager

A Next.js application for creating and managing luxury property listings.

## Features

- **Brenda Devlin's Listings Page**: A form-based interface for creating new property listings
- **Automated Page Generation**: Automatically generates listing pages from form data
- **Beautiful Listing Display**: Responsive, modern listing pages with photo galleries
- **Agent Contact Integration**: Built-in agent contact cards and CTAs

## Getting Started

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the homepage.

## Creating a New Listing

1. Navigate to [http://localhost:3000/brenda-listings](http://localhost:3000/brenda-listings)
2. Fill out all 17 fields:
   - Property Title
   - Address (street, city, state, zip)
   - Price
   - Beds
   - Baths
   - Living Area (sq ft)
   - Lot Size (sq ft)
   - Year Built
   - Property Type
   - Description (story-style paragraph)
   - Key Features (5-8)
   - Points of Interest (2-3)
   - Agent Name
   - Agent Phone
   - Agent Email
   - Photos (hero + 3-5 gallery)
   - Video Transcript (optional)

3. Click "Generate Listing Code"
4. Click "Create Listing File Automatically" to generate the new page
5. Your listing will be available at `/listings/[slug]`

## Project Structure

```
property-listings/
├── app/
│   ├── listings/           # Generated listing pages go here
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── brenda-listings/    # Admin form page
│   │   └── page.tsx
│   ├── api/
│   │   └── create-listing/ # API for file generation
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ListingPage.tsx     # Reusable listing component
└── package.json
```

## Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React**: UI library

## License

Private - All Rights Reserved

