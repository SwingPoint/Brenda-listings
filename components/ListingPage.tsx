import React from 'react';
import Image from 'next/image';
import Head from 'next/head';

export interface ListingData {
  title: string;
  slug: string;
  canonicalUrl: string;
  price: number;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  propertyType: string;
  beds: number;
  baths: number;
  livingAreaSqFt: number;
  lotSizeSqFt: number;
  yearBuilt: number;
  heroPhoto: {
    url: string;
    alt: string;
  };
  gallery: Array<{
    url: string;
    alt: string;
  }>;
  storyIntro: string;
  features: string[];
  neighborhoodName: string;
  pointsOfInterest: Array<{
    name: string;
    minutesAway: number;
  }>;
  agent: {
    name: string;
    phone: string;
    email: string;
    jobTitle: string;
    brokerage: {
      name: string;
    };
  };
  cta: {
    scheduleUrl: string;
    requestReportUrl: string;
  };
  videoTranscript?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface ListingPageProps {
  listing: ListingData;
}

export default function ListingPage({ listing }: ListingPageProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Generate meta description for SEO
  const metaDescription = `${listing.title} - ${listing.beds} bed, ${listing.baths} bath ${listing.propertyType} for ${formatPrice(listing.price)} in ${listing.address.addressLocality}, ${listing.address.addressRegion}. ${listing.storyIntro.substring(0, 100)}...`;

  // Generate full address string
  const fullAddress = `${listing.address.streetAddress}, ${listing.address.addressLocality}, ${listing.address.addressRegion} ${listing.address.postalCode}`;

  // Schema.org structured data for Real Estate Listing
  const propertySchema = {
    "@context": "https://schema.org",
    "@type": listing.propertyType === "Condo" ? "Apartment" : "SingleFamilyResidence",
    "name": listing.title,
    "description": listing.storyIntro,
    "url": listing.canonicalUrl,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": listing.address.streetAddress,
      "addressLocality": listing.address.addressLocality,
      "addressRegion": listing.address.addressRegion,
      "postalCode": listing.address.postalCode,
      "addressCountry": listing.address.addressCountry
    },
    "geo": listing.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": listing.coordinates.latitude,
      "longitude": listing.coordinates.longitude
    } : undefined,
    "numberOfRooms": listing.beds,
    "numberOfBedrooms": listing.beds,
    "numberOfBathroomsTotal": listing.baths,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": listing.livingAreaSqFt,
      "unitCode": "FTK"
    },
    "yearBuilt": listing.yearBuilt,
    "offers": {
      "@type": "Offer",
      "price": listing.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": listing.canonicalUrl
    },
    "image": [listing.heroPhoto.url, ...listing.gallery.map(g => g.url)],
    "amenityFeature": listing.features.map(feature => ({
      "@type": "LocationFeatureSpecification",
      "name": feature
    }))
  };

  // Schema.org structured data for Real Estate Agent
  const agentSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": listing.agent.name,
    "email": listing.agent.email,
    "telephone": listing.agent.phone,
    "jobTitle": listing.agent.jobTitle,
    "worksFor": {
      "@type": "Organization",
      "name": listing.agent.brokerage.name
    }
  };

  // Schema.org structured data for Place (for local SEO/GEO)
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": listing.neighborhoodName,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": listing.address.addressLocality,
      "addressRegion": listing.address.addressRegion,
      "addressCountry": listing.address.addressCountry
    },
    "geo": listing.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": listing.coordinates.latitude,
      "longitude": listing.coordinates.longitude
    } : undefined
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{listing.title} | {formatPrice(listing.price)} | {listing.address.addressLocality}, {listing.address.addressRegion}</title>
        <meta name="title" content={`${listing.title} | ${formatPrice(listing.price)}`} />
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${listing.address.addressLocality} real estate, ${listing.address.addressRegion} homes for sale, ${listing.propertyType}, ${listing.beds} bedroom home, ${listing.agent.brokerage.name}, ${listing.agent.name}`} />
        <link rel="canonical" href={listing.canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={listing.canonicalUrl} />
        <meta property="og:title" content={`${listing.title} | ${formatPrice(listing.price)}`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={listing.heroPhoto.url} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content={listing.agent.brokerage.name} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={listing.canonicalUrl} />
        <meta name="twitter:title" content={`${listing.title} | ${formatPrice(listing.price)}`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={listing.heroPhoto.url} />

        {/* Geographic Meta Tags for Local SEO */}
        <meta name="geo.region" content={`US-${listing.address.addressRegion}`} />
        <meta name="geo.placename" content={listing.address.addressLocality} />
        {listing.coordinates && (
          <>
            <meta name="geo.position" content={`${listing.coordinates.latitude};${listing.coordinates.longitude}`} />
            <meta name="ICBM" content={`${listing.coordinates.latitude}, ${listing.coordinates.longitude}`} />
          </>
        )}

        {/* Schema.org JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(agentSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={listing.heroPhoto.url}
          alt={listing.heroPhoto.alt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {listing.title}
            </h1>
            <p className="text-2xl text-white font-semibold">
              {formatPrice(listing.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-gray-500 text-sm">Beds</p>
                  <p className="text-2xl font-bold">{listing.beds}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Baths</p>
                  <p className="text-2xl font-bold">{listing.baths}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Living Area</p>
                  <p className="text-2xl font-bold">{formatNumber(listing.livingAreaSqFt)}</p>
                  <p className="text-gray-500 text-xs">sq ft</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Lot Size</p>
                  <p className="text-2xl font-bold">{formatNumber(listing.lotSizeSqFt)}</p>
                  <p className="text-gray-500 text-xs">sq ft</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <p className="text-gray-700">
                  <span className="font-semibold">Built:</span> {listing.yearBuilt}
                  {' • '}
                  <span className="font-semibold">Type:</span> {listing.propertyType}
                </p>
                <p className="text-gray-700 mt-2">
                  <span className="font-semibold">Address:</span>{' '}
                  {listing.address.streetAddress}, {listing.address.addressLocality},{' '}
                  {listing.address.addressRegion} {listing.address.postalCode}
                </p>
              </div>
            </div>

            {/* Story Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Property</h2>
              <p className="text-gray-700 leading-relaxed">{listing.storyIntro}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {listing.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.gallery.map((photo, index) => (
                  <div key={index} className="relative h-48">
                    <Image
                      src={photo.url}
                      alt={photo.alt}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Neighborhood */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">
                About {listing.neighborhoodName}
              </h2>
              <h3 className="text-lg font-semibold mb-3">Points of Interest</h3>
              <ul className="space-y-2">
                {listing.pointsOfInterest.map((poi, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {poi.name} - {poi.minutesAway} min away
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Video Transcript */}
            {listing.videoTranscript && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Video Transcript</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {listing.videoTranscript}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Agent Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Contact Agent</h2>
              <div className="mb-4">
                <p className="text-lg font-semibold">{listing.agent.name}</p>
                <p className="text-gray-600 text-sm">{listing.agent.jobTitle}</p>
                <p className="text-gray-600 text-sm">{listing.agent.brokerage.name}</p>
              </div>
              <div className="space-y-3 mb-6">
                <a
                  href={`tel:${listing.agent.phone}`}
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {listing.agent.phone}
                </a>
                <a
                  href={`mailto:${listing.agent.email}`}
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {listing.agent.email}
                </a>
              </div>
              <div className="space-y-3">
                <a
                  href={listing.cta.scheduleUrl}
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Schedule Showing
                </a>
                <a
                  href={listing.cta.requestReportUrl}
                  className="block w-full bg-gray-200 text-gray-800 text-center py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Request Report
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

