import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-8">
          Property Listings Manager
        </h1>
        <div className="space-y-4">
          <Link
            href="/brenda-listings"
            className="block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-xl hover:bg-gray-100 transition shadow-lg"
          >
            Create New Listing
          </Link>
          <p className="text-white text-sm">
            Access Brenda Devlin&apos;s Listings Page
          </p>
        </div>
      </div>
    </div>
  );
}

