import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login - Aaron Coleman Music',
  description: 'Admin access to content management system.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Admin Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Content Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Admin Panel Setup Required
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        The admin panel is currently under development. 
                        Once the backend is deployed, you'll be able to log in here to manage content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Admin Features
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create and edit pages</li>
                  <li>• Manage blog posts</li>
                  <li>• Upload and organize media</li>
                  <li>• SEO optimization tools</li>
                  <li>• Analytics dashboard</li>
                  <li>• Content blocks management</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Development Access
                </h3>
                <div className="space-y-2">
                  <a 
                    href="http://localhost:8000/django-admin/" 
                    className="block w-full text-center bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Django Admin (Development)
                  </a>
                  <a 
                    href="http://localhost:8000/api/v1/" 
                    className="block w-full text-center bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    API Documentation
                  </a>
                </div>
              </div>

              <div className="text-center">
                <a 
                  href="/" 
                  className="text-primary-600 hover:text-primary-500 transition-colors"
                >
                  ← Back to Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 