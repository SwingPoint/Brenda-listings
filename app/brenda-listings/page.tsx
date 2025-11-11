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
    videoTranscript: ''
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [slug, setSlug] = useState('');

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
    videoTranscript: "${formData.videoTranscript.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"` : ''}
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
          videoTranscript: ''
        });
        setGeneratedCode('');
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

            {/* Generate Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleGenerateCode}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                Generate Listing Code
              </button>
            </div>
          </form>

          {/* Generated Code Display */}
          {generatedCode && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-blue-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Generated Code
                </h2>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    alert('Code copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  Copy Code
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
        </div>
      </div>
    </div>
  );
}

