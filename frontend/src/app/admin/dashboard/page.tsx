'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'

interface DashboardStats {
  pages: number
  blogPosts: number
  sections: number
  contentBlocks: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    pages: 0,
    blogPosts: 0,
    sections: 0,
    contentBlocks: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [pagesRes, blogRes, sectionsRes, blocksRes] = await Promise.all([
        api.getPages(),
        api.getBlogPosts(),
        api.getSections(),
        api.getContentBlocks()
      ])

      setStats({
        pages: pagesRes.data.results?.length || pagesRes.data.length || 0,
        blogPosts: blogRes.data.results?.length || blogRes.data.length || 0,
        sections: sectionsRes.data.results?.length || sectionsRes.data.length || 0,
        contentBlocks: blocksRes.data.results?.length || blocksRes.data.length || 0
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    api.logout()
    window.location.href = '/admin/login'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                CMS Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                target="_blank"
              >
                View Website
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Welcome to Aaron Coleman Music CMS
            </h2>
            <p className="text-primary-100">
              Your professional content management system for musicians. Create, manage, and showcase your music to the world.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link
                href="/admin/pages/new"
                className="bg-white text-primary-600 px-4 py-2 rounded-md font-medium hover:bg-primary-50 transition-colors"
              >
                Create New Page
              </Link>
              <Link
                href="/admin/media"
                className="bg-primary-500 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-400 transition-colors"
              >
                Upload Media
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Blog Posts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.blogPosts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sections</p>
                <p className="text-2xl font-bold text-gray-900">{stats.sections}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Content Blocks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contentBlocks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Music CMS Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Music & Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Music & Content</h3>
            </div>
            <div className="space-y-3">
              <Link
                href="/admin/pages"
                className="block p-3 border border-gray-200 rounded-md hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Pages</h4>
                    <p className="text-sm text-gray-600">About, Music, Tours</p>
                  </div>
                  <span className="text-purple-600 font-semibold">{stats.pages}</span>
                </div>
              </Link>

              <Link
                href="/admin/blog"
                className="block p-3 border border-gray-200 rounded-md hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">News & Updates</h4>
                    <p className="text-sm text-gray-600">Blog posts and announcements</p>
                  </div>
                  <span className="text-purple-600 font-semibold">{stats.blogPosts}</span>
                </div>
              </Link>

              <Link
                href="/admin/sections"
                className="block p-3 border border-gray-200 rounded-md hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Site Structure</h4>
                    <p className="text-sm text-gray-600">Organize content sections</p>
                  </div>
                  <span className="text-purple-600 font-semibold">{stats.sections}</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Media & Gallery */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Media & Gallery</h3>
            </div>
            <div className="space-y-3">
              <Link
                href="/admin/media"
                className="block p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Photo Library</h4>
                    <p className="text-sm text-gray-600">High-res photos & album art</p>
                  </div>
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </Link>

              <Link
                href="/admin/gallery"
                className="block p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Photo Galleries</h4>
                    <p className="text-sm text-gray-600">Concerts, backstage, studio</p>
                  </div>
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              <Link
                href="/admin/blocks"
                className="block p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Content Blocks</h4>
                    <p className="text-sm text-gray-600">Reusable components</p>
                  </div>
                  <span className="text-blue-600 font-semibold">{stats.contentBlocks}</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Performance & Growth */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Performance & Growth</h3>
            </div>
            <div className="space-y-3">
              <Link
                href="/admin/analytics"
                className="block p-3 border border-gray-200 rounded-md hover:bg-green-50 hover:border-green-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Website Analytics</h4>
                    <p className="text-sm text-gray-600">Fan engagement & traffic</p>
                  </div>
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </Link>

              <Link
                href="/admin/seo"
                className="block p-3 border border-gray-200 rounded-md hover:bg-green-50 hover:border-green-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">SEO Optimization</h4>
                    <p className="text-sm text-gray-600">Search engine visibility</p>
                  </div>
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </Link>

              <Link
                href="/admin/social"
                className="block p-3 border border-gray-200 rounded-md hover:bg-green-50 hover:border-green-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Social Media</h4>
                    <p className="text-sm text-gray-600">Cross-platform sharing</p>
                  </div>
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Professional Musician Guide */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Essential Pages for Musicians
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">About Page</h4>
                  <p className="text-sm text-gray-600">Your story, biography, and musical journey</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Music/Discography</h4>
                  <p className="text-sm text-gray-600">Albums, singles, and streaming links</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Tour Dates</h4>
                  <p className="text-sm text-gray-600">Upcoming shows and ticket information</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm font-semibold">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Contact & Booking</h4>
                  <p className="text-sm text-gray-600">How fans and venues can reach you</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/admin/pages/new"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Create Your First Page
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Professional Tips
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium text-gray-900">High-Quality Images</h4>
                  <p className="text-sm text-gray-600">Use professional photos for better engagement and press coverage</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium text-gray-900">Regular Updates</h4>
                  <p className="text-sm text-gray-600">Keep fans engaged with news, behind-the-scenes content, and announcements</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium text-gray-900">SEO Optimization</h4>
                  <p className="text-sm text-gray-600">Fill in meta descriptions and titles to help fans discover your music</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium text-gray-900">Mobile-First</h4>
                  <p className="text-sm text-gray-600">Most fans will visit on mobile - your content is automatically optimized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 