import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aaron Coleman Music - Home',
  description: 'Welcome to Aaron Coleman Music. Professional musician and composer.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Aaron Coleman Music
              </h1>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
              <a href="#music" className="text-gray-600 hover:text-gray-900 transition-colors">
                Music
              </a>
              <a href="#blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </a>
              <a 
                href="/admin" 
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Musician
            <span className="block text-primary-600">& Composer</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Welcome to my musical world. Discover original compositions, live performances, 
            and the passion that drives my artistic journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary text-lg px-8 py-3">
              Listen to My Music
            </button>
            <button className="btn btn-outline text-lg px-8 py-3">
              Book a Performance
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Musical Excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bringing passion and professionalism to every performance and composition.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Original Compositions
              </h3>
              <p className="text-gray-600">
                Unique musical pieces crafted with creativity and technical expertise.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Live Performances
              </h3>
              <p className="text-gray-600">
                Captivating live shows that connect with audiences on an emotional level.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Collaborations
              </h3>
              <p className="text-gray-600">
                Working with other artists to create memorable musical experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CMS Powered Notice */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Website Under Construction
            </h3>
            <p className="text-gray-600 mb-6">
              This website is powered by a custom Content Management System. 
              The admin can easily update content, add blog posts, and manage media files.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/admin" 
                className="btn btn-primary"
              >
                Access Admin Panel
              </a>
              <a 
                href="/api/v1/" 
                className="btn btn-outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View API Documentation
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Default admin credentials: admin / admin123
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Aaron Coleman Music</h3>
              <p className="text-gray-400">
                Professional musician and composer creating memorable musical experiences.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors">About</a>
                <a href="#music" className="block text-gray-400 hover:text-white transition-colors">Music</a>
                <a href="#blog" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
                <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">YouTube</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Spotify</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">SoundCloud</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Aaron Coleman Music. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 