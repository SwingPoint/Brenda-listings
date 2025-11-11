'use client';

import React, { useState } from 'react';

export default function BrendaListingsPage() {
  const [formData, setFormData] = useState({
    // 1. Property Title
    title: '',
    
    // 2. Address
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
    
    // 3. Price
    price: '',
    
    // 4. Beds
    beds: '',
    
    // 5. Baths
    baths: '',
    
    // 6. Living Area
    livingArea: '',
    
    // 7. Lot Size
    lotSize: '',
    
    // 8. Year Built
    yearBuilt: '',
    
    // 9. Property Type
    propertyType: 'Single Family',
    
    // 10. Description
    description: '',
    
    // 11. Key Features (5-8)
    features: ['', '', '', '', '', '', '', ''],
    
    // 12. Points of Interest (2-3)
    poi: [
      { name: '', minutes: '' },
      { name: '', minutes: '' },
      { name: '', minutes: '' }
    ],
    
    // 13-15. Agent Info
    agentName: '',
    agentPhone: '',
    agentEmail: '',
    
    // 16. Photos
    heroPhotoUrl: '',
    galleryPhotos: ['', '', '', '', ''],
    
    // 17. Video Transcript
    videoTranscript: '',
    
    // 18. Coordinates (for GEO SEO)
    latitude: '',
    longitude: ''
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [generatedJSON, setGeneratedJSON] = useState('');
  const [slug, setSlug] = useState('');
  const [outputFormat, setOutputFormat] = useState<'nextjs' | 'wordpress'>('nextjs');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handlePOIChange = (index: number, field: 'name' | 'minutes', value: string) => {
    const newPOI = [...formData.poi];
    newPOI[index] = { ...newPOI[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      poi: newPOI
    }));
  };

  const handleGalleryChange = (index: number, value: string) => {
    const newGallery = [...formData.galleryPhotos];
    newGallery[index] = value;
    setFormData(prev => ({
      ...prev,
      galleryPhotos: newGallery
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleGenerateCode = () => {
    const generatedSlug = generateSlug(formData.title);
    setSlug(generatedSlug);

    // Filter out empty features
    const validFeatures = formData.features.filter(f => f.trim() !== '');
    
    // Filter out empty POIs
    const validPOI = formData.poi.filter(p => p.name.trim() !== '' && p.minutes.trim() !== '');
    
    // Filter out empty gallery photos
    const validGallery = formData.galleryPhotos.filter(p => p.trim() !== '');

    // Get neighborhood name from city
    const neighborhoodName = formData.city || 'the Area';

    // Generate WordPress JSON
    const wordpressJSON = {
      title: formData.title,
      slug: generatedSlug,
      canonicalUrl: `https://example.com/listings/${generatedSlug}`,
      price: parseFloat(formData.price) || 0,
      address: {
        streetAddress: formData.streetAddress,
        addressLocality: formData.city,
        addressRegion: formData.state,
        postalCode: formData.zip,
        addressCountry: "US"
      },
      propertyType: formData.propertyType.replace(/\s+/g, ''),
      beds: parseInt(formData.beds) || 0,
      baths: parseFloat(formData.baths) || 0,
      livingAreaSqFt: parseInt(formData.livingArea) || 0,
      lotSizeSqFt: parseInt(formData.lotSize) || 0,
      yearBuilt: parseInt(formData.yearBuilt) || 0,
      heroPhoto: {
        url: formData.heroPhotoUrl,
        alt: `${formData.title} - Hero Image`
      },
      gallery: validGallery.map((url, idx) => ({
        url: url,
        alt: `${formData.title} - Photo ${idx + 1}`
      })),
      storyIntro: formData.description,
      features: validFeatures,
      neighborhoodName: neighborhoodName,
      pointsOfInterest: validPOI.map(p => ({
        name: p.name,
        minutesAway: parseInt(p.minutes) || 0
      })),
      agent: {
        name: formData.agentName,
        phone: formData.agentPhone,
        email: formData.agentEmail,
        jobTitle: "Real Estate Agent",
        brokerage: {
          name: "Windermere Homes & Estates"
        }
      },
      cta: {
        scheduleUrl: "/book",
        requestReportUrl: "/report"
      },
      ...(formData.videoTranscript && { videoTranscript: formData.videoTranscript }),
      ...(formData.latitude && formData.longitude && {
        coordinates: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        }
      })
    };

    setGeneratedJSON(JSON.stringify(wordpressJSON, null, 2));

    const code = `import ListingPage from "@/components/ListingPage";

export default function Page() {
  const listing = {
    title: "${formData.title}",
    slug: "${generatedSlug}",
    canonicalUrl: "https://example.com/listings/${generatedSlug}",
    price: ${formData.price || 0},
    address: {
      streetAddress: "${formData.streetAddress}",
      addressLocality: "${formData.city}",
      addressRegion: "${formData.state}",
      postalCode: "${formData.zip}",
      addressCountry: "US",
    },
    propertyType: "${formData.propertyType.replace(/\s+/g, '')}",
    beds: ${formData.beds || 0},
    baths: ${formData.baths || 0},
    livingAreaSqFt: ${formData.livingArea || 0},
    lotSizeSqFt: ${formData.lotSize || 0},
    yearBuilt: ${formData.yearBuilt || 0},
    heroPhoto: { 
      url: "${formData.heroPhotoUrl}", 
      alt: "${formData.title} - Hero Image" 
    },
    gallery: [${validGallery.map((url, idx) => `
      { url: "${url}", alt: "${formData.title} - Photo ${idx + 1}" }`).join(',')}
    ],
    storyIntro: "${formData.description.replace(/"/g, '\\"').replace(/\n/g, ' ')}",
    features: [${validFeatures.map(f => `
      "${f}"`).join(',')}
    ],
    neighborhoodName: "${neighborhoodName}",
    pointsOfInterest: [${validPOI.map(p => `
      { name: "${p.name}", minutesAway: ${p.minutes} }`).join(',')}
    ],
    agent: {
      name: "${formData.agentName}",
      phone: "${formData.agentPhone}",
      email: "${formData.agentEmail}",
      jobTitle: "Real Estate Agent",
      brokerage: { name: "Windermere Homes & Estates" }
    },
    cta: {
      scheduleUrl: "/book",
      requestReportUrl: "/report"
    }${formData.videoTranscript ? `,
    videoTranscript: "${formData.videoTranscript.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"` : ''}${formData.latitude && formData.longitude ? `,
    coordinates: {
      latitude: ${formData.latitude},
      longitude: ${formData.longitude}
    }` : ''}
  };

  return <ListingPage listing={listing} />;
}
`;

    setGeneratedCode(code);
  };

  const handleSaveFile = async () => {
    if (!generatedCode || !slug) {
      alert('Please generate the code first!');
      return;
    }

    try {
      const response = await fetch('/api/create-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          code: generatedCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Success! Listing page created at:\napp/listings/${slug}/page.tsx\n\nYou can now view it at:\nhttp://localhost:3000/listings/${slug}`);
        
        // Reset form
        setFormData({
          title: '',
          streetAddress: '',
          city: '',
          state: '',
          zip: '',
          price: '',
          beds: '',
          baths: '',
          livingArea: '',
          lotSize: '',
          yearBuilt: '',
          propertyType: 'Single Family',
          description: '',
          features: ['', '', '', '', '', '', '', ''],
          poi: [
            { name: '', minutes: '' },
            { name: '', minutes: '' },
            { name: '', minutes: '' }
          ],
          agentName: '',
          agentPhone: '',
          agentEmail: '',
          heroPhotoUrl: '',
          galleryPhotos: ['', '', '', '', ''],
          videoTranscript: '',
          latitude: '',
          longitude: ''
        });
        setGeneratedCode('');
        setGeneratedJSON('');
        setSlug('');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Error creating listing. Please copy the code manually and create the file at:\napp/listings/' + slug + '/page.tsx');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Brenda Devlin&apos;s Listings Page
          </h1>
          <p className="text-gray-600 mb-8">
            Fill out the form below to create a new property listing page
          </p>

          <form className="space-y-8">
            {/* 1. Property Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                1. Property Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Stunning Waterfront Estate"
              />
            </div>

            {/* 2. Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                2. Address *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Street Address"
                />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                />
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="State"
                />
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => handleInputChange('zip', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ZIP Code"
                />
              </div>
            </div>

            {/* 3-8. Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  3. Price *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 1250000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  4. Beds *
                </label>
                <input
                  type="number"
                  value={formData.beds}
                  onChange={(e) => handleInputChange('beds', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 4"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  5. Baths *
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.baths}
                  onChange={(e) => handleInputChange('baths', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3.5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  6. Living Area (sq ft) *
                </label>
                <input
                  type="number"
                  value={formData.livingArea}
                  onChange={(e) => handleInputChange('livingArea', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  7. Lot Size (sq ft) *
                </label>
                <input
                  type="number"
                  value={formData.lotSize}
                  onChange={(e) => handleInputChange('lotSize', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 10000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  8. Year Built *
                </label>
                <input
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2020"
                />
              </div>
            </div>

            {/* 9. Property Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                9. Property Type *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Single Family">Single Family</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Multi Family">Multi Family</option>
                <option value="Land">Land</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* 10. Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                10. Description (Story-style paragraph) *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write a compelling story about this property..."
              />
            </div>

            {/* 11. Key Features */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                11. Key Features (5-8 features) *
              </label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <input
                    key={index}
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Feature ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* 12. Points of Interest */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                12. Points of Interest (2-3 locations) *
              </label>
              <div className="space-y-3">
                {formData.poi.map((poi, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={poi.name}
                      onChange={(e) => handlePOIChange(index, 'name', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Name (e.g., Downtown Seattle)"
                    />
                    <input
                      type="number"
                      value={poi.minutes}
                      onChange={(e) => handlePOIChange(index, 'minutes', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Minutes away"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 13-15. Agent Info */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                13-15. Agent Information *
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.agentName}
                  onChange={(e) => handleInputChange('agentName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Agent Name"
                />
                <input
                  type="tel"
                  value={formData.agentPhone}
                  onChange={(e) => handleInputChange('agentPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Agent Phone"
                />
                <input
                  type="email"
                  value={formData.agentEmail}
                  onChange={(e) => handleInputChange('agentEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Agent Email"
                />
              </div>
            </div>

            {/* 16. Photos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                16. Photos *
              </label>
              <div className="space-y-3">
                <input
                  type="url"
                  value={formData.heroPhotoUrl}
                  onChange={(e) => handleInputChange('heroPhotoUrl', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Hero Photo URL"
                />
                <p className="text-sm text-gray-500">Gallery Photos (3-5 photos):</p>
                {formData.galleryPhotos.map((photo, index) => (
                  <input
                    key={index}
                    type="url"
                    value={photo}
                    onChange={(e) => handleGalleryChange(index, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Gallery Photo ${index + 1} URL`}
                  />
                ))}
              </div>
            </div>

            {/* 17. Video Transcript */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                17. Video Transcript (Optional)
              </label>
              <textarea
                value={formData.videoTranscript}
                onChange={(e) => handleInputChange('videoTranscript', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Video transcript or leave blank..."
              />
            </div>

            {/* 18. GPS Coordinates (for GEO SEO) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                18. GPS Coordinates (Optional - for enhanced local SEO)
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Find coordinates at <a href="https://www.latlong.net/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">latlong.net</a>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Latitude (e.g., 47.6062)"
                />
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Longitude (e.g., -122.3321)"
                />
              </div>
            </div>

            {/* Output Format Selection */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Output Format:
              </label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setOutputFormat('nextjs')}
                  className={`py-3 px-4 rounded-lg font-semibold transition ${
                    outputFormat === 'nextjs'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  📄 Next.js Code
                </button>
                <button
                  type="button"
                  onClick={() => setOutputFormat('wordpress')}
                  className={`py-3 px-4 rounded-lg font-semibold transition ${
                    outputFormat === 'wordpress'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  🔌 WordPress JSON
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {outputFormat === 'nextjs' 
                  ? '✨ Generate Next.js page code for this Vercel site'
                  : '✨ Generate WordPress-ready JSON to paste into your WP site'}
              </p>
            </div>

            {/* Generate Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleGenerateCode}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                {outputFormat === 'nextjs' ? '🚀 Generate Next.js Code' : '🔌 Generate WordPress JSON'}
              </button>
            </div>
          </form>

          {/* Generated Code Display - Next.js */}
          {generatedCode && outputFormat === 'nextjs' && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-blue-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  📄 Generated Next.js Code
                </h2>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    alert('Code copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  📋 Copy Code
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-semibold text-blue-800">
                  📁 File Location:
                </p>
                <code className="text-sm text-blue-600">
                  app/listings/{slug}/page.tsx
                </code>
              </div>

              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                {generatedCode}
              </pre>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleSaveFile}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  💾 Create Listing File Automatically
                </button>
                
                <div className="text-sm text-gray-600 text-center">
                  <p>Or manually create the file at:</p>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded">
                    app/listings/{slug}/page.tsx
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Generated Code Display - WordPress JSON */}
          {generatedJSON && outputFormat === 'wordpress' && (
            <div className="mt-8 space-y-6">
              
              {/* WordPress Installation Instructions */}
              <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  📦 WordPress Installation - 3 Files Needed
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                  To display your property listing in WordPress, you need to copy 3 things:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 mb-4">
                  <li><strong>PHP Code</strong> - Add to WordPress functions.php or Code Snippets plugin</li>
                  <li><strong>CSS Styles</strong> - Add to Appearance → Customize → Additional CSS</li>
                  <li><strong>JSON Data</strong> - Add to your page as a custom field or content</li>
                </ol>
                <p className="text-xs text-blue-800 font-semibold">
                  👇 Scroll down to copy each file in order
                </p>
              </div>

              {/* Step 1: PHP Code */}
              <div className="p-6 bg-purple-50 rounded-lg border-2 border-purple-300">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Step 1️⃣: Copy PHP Code
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Add this to WordPress → Appearance → Theme File Editor → functions.php
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const phpCode = `<?php
/**
 * Property Listing Shortcode for WordPress
 * Add this code to your theme's functions.php file
 */

function property_listing_shortcode($atts) {
    $atts = shortcode_atts(array(
        'field' => 'property_listing_json',
    ), $atts);
    
    $json_data = get_post_meta(get_the_ID(), $atts['field'], true);
    
    if (empty($json_data)) {
        return '<p style="color:red;">No property listing data found. Add JSON to custom field: property_listing_json</p>';
    }
    
    $listing = json_decode($json_data, true);
    if (!$listing) {
        return '<p style="color:red;">Error parsing JSON data.</p>';
    }
    
    $price = '$' . number_format($listing['price']);
    
    ob_start();
    ?>
    <div class="property-listing-container">
        <div class="property-hero" style="background-image: url('<?php echo esc_url($listing['heroPhoto']['url']); ?>');">
            <div class="property-hero-overlay">
                <div class="property-hero-content">
                    <h1 class="property-title"><?php echo esc_html($listing['title']); ?></h1>
                    <p class="property-price"><?php echo esc_html($price); ?></p>
                </div>
            </div>
        </div>
        
        <div class="property-content-wrapper">
            <div class="property-main-content">
                <div class="property-stats-card">
                    <div class="property-stats-grid">
                        <div class="property-stat">
                            <span class="stat-label">Beds</span>
                            <span class="stat-value"><?php echo esc_html($listing['beds']); ?></span>
                        </div>
                        <div class="property-stat">
                            <span class="stat-label">Baths</span>
                            <span class="stat-value"><?php echo esc_html($listing['baths']); ?></span>
                        </div>
                        <div class="property-stat">
                            <span class="stat-label">Living Area</span>
                            <span class="stat-value"><?php echo esc_html(number_format($listing['livingAreaSqFt'])); ?></span>
                            <span class="stat-unit">sq ft</span>
                        </div>
                        <div class="property-stat">
                            <span class="stat-label">Lot Size</span>
                            <span class="stat-value"><?php echo esc_html(number_format($listing['lotSizeSqFt'])); ?></span>
                            <span class="stat-unit">sq ft</span>
                        </div>
                    </div>
                    <div class="property-details-footer">
                        <p><strong>Built:</strong> <?php echo esc_html($listing['yearBuilt']); ?> • <strong>Type:</strong> <?php echo esc_html($listing['propertyType']); ?></p>
                        <p><strong>Address:</strong> <?php echo esc_html($listing['address']['streetAddress']); ?>, <?php echo esc_html($listing['address']['addressLocality']); ?>, <?php echo esc_html($listing['address']['addressRegion']); ?> <?php echo esc_html($listing['address']['postalCode']); ?></p>
                    </div>
                </div>
                
                <div class="property-card">
                    <h2>About This Property</h2>
                    <p><?php echo esc_html($listing['storyIntro']); ?></p>
                </div>
                
                <div class="property-card">
                    <h2>Key Features</h2>
                    <ul class="property-features-list">
                        <?php foreach ($listing['features'] as $feature): ?>
                            <li class="property-feature">
                                <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                <span><?php echo esc_html($feature); ?></span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                
                <?php if (!empty($listing['gallery'])): ?>
                <div class="property-card">
                    <h2>Photo Gallery</h2>
                    <div class="property-gallery">
                        <?php foreach ($listing['gallery'] as $photo): ?>
                            <div class="gallery-item">
                                <img src="<?php echo esc_url($photo['url']); ?>" alt="<?php echo esc_attr($photo['alt']); ?>">
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>
                
                <div class="property-card">
                    <h2>About <?php echo esc_html($listing['neighborhoodName']); ?></h2>
                    <h3>Points of Interest</h3>
                    <ul class="property-poi-list">
                        <?php foreach ($listing['pointsOfInterest'] as $poi): ?>
                            <li class="property-poi">
                                <svg class="poi-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                                </svg>
                                <span><?php echo esc_html($poi['name']); ?> - <?php echo esc_html($poi['minutesAway']); ?> min</span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
            
            <div class="property-sidebar">
                <div class="property-agent-card">
                    <h2>Contact Agent</h2>
                    <div class="agent-info">
                        <p class="agent-name"><?php echo esc_html($listing['agent']['name']); ?></p>
                        <p class="agent-title"><?php echo esc_html($listing['agent']['jobTitle']); ?></p>
                        <p class="agent-company"><?php echo esc_html($listing['agent']['brokerage']['name']); ?></p>
                    </div>
                    <div class="agent-contact">
                        <a href="tel:<?php echo esc_attr($listing['agent']['phone']); ?>" class="agent-contact-link">
                            <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                            <?php echo esc_html($listing['agent']['phone']); ?>
                        </a>
                        <a href="mailto:<?php echo esc_attr($listing['agent']['email']); ?>" class="agent-contact-link">
                            <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                            <?php echo esc_html($listing['agent']['email']); ?>
                        </a>
                    </div>
                    <div class="agent-cta-buttons">
                        <a href="<?php echo esc_url($listing['cta']['scheduleUrl']); ?>" class="btn btn-primary">Schedule Showing</a>
                        <a href="<?php echo esc_url($listing['cta']['requestReportUrl']); ?>" class="btn btn-secondary">Request Report</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('property_listing', 'property_listing_shortcode');
?>`;
                      navigator.clipboard.writeText(phpCode);
                      alert('✅ PHP Code copied to clipboard!\n\nPaste this into WordPress:\nAppearance → Theme File Editor → functions.php');
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition font-semibold whitespace-nowrap"
                  >
                    📋 Copy PHP
                  </button>
                </div>
                <div className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-xs max-h-48">
                  <pre>&lt;?php{'\n'}function property_listing_shortcode($atts) {'{'}{'\n'}  // Renders beautiful property listing from JSON{'\n'}  // ... (full code will be copied){'\n'}{'}'}{'\n'}add_shortcode('property_listing', 'property_listing_shortcode');{'\n'}?&gt;</pre>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  ⚠️ Important: Add this ONCE to your functions.php file. Scroll to the bottom of the file and paste.
                </p>
              </div>

              {/* Step 2: CSS Styles */}
              <div className="p-6 bg-pink-50 rounded-lg border-2 border-pink-300">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Step 2️⃣: Copy CSS Styles
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Add this to WordPress → Appearance → Customize → Additional CSS
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const cssCode = `.property-listing-container { max-width: 100%; margin: 0 auto; background: #f9fafb; }
.property-hero { position: relative; height: 60vh; min-height: 400px; background-size: cover; background-position: center; margin-bottom: 3rem; }
.property-hero-overlay { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.4); display: flex; align-items: flex-end; }
.property-hero-content { width: 100%; max-width: 1200px; margin: 0 auto; padding: 3rem 1rem; }
.property-title { font-size: 2.5rem; font-weight: bold; color: white; margin: 0 0 1rem 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
.property-price { font-size: 1.875rem; font-weight: 600; color: white; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
.property-content-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 1rem 3rem; display: grid; grid-template-columns: 1fr; gap: 2rem; }
@media (min-width: 1024px) { .property-content-wrapper { grid-template-columns: 2fr 1fr; } }
.property-card, .property-stats-card { background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem; margin-bottom: 2rem; }
.property-card h2 { font-size: 1.5rem; font-weight: bold; margin: 0 0 1rem 0; color: #1f2937; }
.property-card h3 { font-size: 1.125rem; font-weight: 600; margin: 1.5rem 0 0.75rem 0; color: #374151; }
.property-stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
@media (min-width: 768px) { .property-stats-grid { grid-template-columns: repeat(4, 1fr); } }
.property-stat { text-align: center; }
.stat-label { display: block; font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem; }
.stat-value { display: block; font-size: 1.5rem; font-weight: bold; color: #1f2937; }
.stat-unit { display: block; font-size: 0.75rem; color: #6b7280; }
.property-details-footer { padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
.property-details-footer p { margin: 0.5rem 0; color: #374151; }
.property-features-list { display: grid; grid-template-columns: 1fr; gap: 0.75rem; list-style: none; padding: 0; margin: 0; }
@media (min-width: 768px) { .property-features-list { grid-template-columns: repeat(2, 1fr); } }
.property-feature { display: flex; align-items: flex-start; gap: 0.5rem; }
.feature-icon { width: 1.25rem; height: 1.25rem; color: #10b981; flex-shrink: 0; margin-top: 0.125rem; }
.property-gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
@media (min-width: 768px) { .property-gallery { grid-template-columns: repeat(3, 1fr); } }
.gallery-item { position: relative; height: 12rem; overflow: hidden; border-radius: 0.5rem; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.gallery-item:hover img { transform: scale(1.05); }
.property-poi-list { list-style: none; padding: 0; margin: 0; }
.property-poi { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; color: #374151; }
.poi-icon { width: 1.25rem; height: 1.25rem; color: #3b82f6; flex-shrink: 0; }
.property-agent-card { background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem; position: sticky; top: 1rem; }
.property-agent-card h2 { font-size: 1.25rem; font-weight: bold; margin: 0 0 1rem 0; color: #1f2937; }
.agent-info { margin-bottom: 1.5rem; }
.agent-name { font-size: 1.125rem; font-weight: 600; margin: 0 0 0.25rem 0; color: #1f2937; }
.agent-title, .agent-company { font-size: 0.875rem; color: #6b7280; margin: 0.125rem 0; }
.agent-contact { margin-bottom: 1.5rem; }
.agent-contact-link { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 0; color: #374151; text-decoration: none; transition: color 0.2s; }
.agent-contact-link:hover { color: #2563eb; }
.contact-icon { width: 1.25rem; height: 1.25rem; flex-shrink: 0; }
.agent-cta-buttons { display: flex; flex-direction: column; gap: 0.75rem; }
.btn { display: block; text-align: center; padding: 0.75rem 1rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
.btn-primary { background: #2563eb; color: white; }
.btn-primary:hover { background: #1d4ed8; }
.btn-secondary { background: #e5e7eb; color: #1f2937; }
.btn-secondary:hover { background: #d1d5db; }`;
                      navigator.clipboard.writeText(cssCode);
                      alert('✅ CSS Styles copied to clipboard!\n\nPaste this into WordPress:\nAppearance → Customize → Additional CSS');
                    }}
                    className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition font-semibold whitespace-nowrap"
                  >
                    📋 Copy CSS
                  </button>
                </div>
                <div className="bg-gray-800 text-blue-400 p-4 rounded-lg overflow-x-auto text-xs max-h-48">
                  <pre>.property-listing-container {'{'} max-width: 100%; margin: 0 auto; background: #f9fafb; {'}'}{'\n'}.property-hero {'{'} position: relative; height: 60vh; ...{'}'}{'\n'}/* ... (full CSS will be copied) */</pre>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  💅 This makes your property listing look beautiful and matches the Next.js design
                </p>
              </div>

              {/* Step 3: JSON Data */}
            <div className="p-6 bg-gray-50 rounded-lg border-2 border-green-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Step 3️⃣: Copy JSON Data
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Add this to WordPress → Custom Field named "property_listing_json"
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedJSON);
                    alert('JSON copied to clipboard! ✅\n\nPaste this into your WordPress custom field or block.');
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
                >
                  📋 Copy JSON
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded">
                <p className="text-sm font-semibold text-green-800 mb-2">
                  ✅ How to Add to WordPress Page:
                </p>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Create a new page in WordPress</li>
                  <li>Scroll to <strong>Custom Fields</strong> section (enable it if hidden)</li>
                  <li>Click <strong>Add New Custom Field</strong></li>
                  <li>Name: <code className="bg-gray-200 px-1 rounded">property_listing_json</code></li>
                  <li>Value: Paste the JSON data below</li>
                  <li>In the page editor, add this shortcode: <code className="bg-gray-200 px-1 rounded">[property_listing]</code></li>
                  <li>Click <strong>Publish</strong> and view your beautiful listing! 🎉</li>
                </ol>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Make sure you've completed Steps 1 & 2 (PHP and CSS) first!
                </p>
              </div>

              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
                <p className="text-xs font-semibold text-yellow-800">
                  📊 Data Summary: {slug}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {formData.beds} beds • {formData.baths} baths • ${formData.price?.toLocaleString()} • {formData.city}, {formData.state}
                </p>
              </div>

              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                {generatedJSON}
              </pre>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const blob = new Blob([generatedJSON], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `listing-${slug}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    alert('JSON file downloaded! 📥');
                  }}
                  className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  💾 Download JSON File
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedJSON);
                    alert('JSON copied to clipboard! ✅');
                  }}
                  className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

