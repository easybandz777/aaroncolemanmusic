'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Page, ContentSection } from '@/types'

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([])
  const [sections, setSections] = useState<ContentSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [pagesRes, sectionsRes] = await Promise.all([
        api.getPages(),
        api.getSections()
      ])
      setPages(pagesRes.data.results || pagesRes.data || [])
      setSections(sectionsRes.data.results || sectionsRes.data || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this page?')) return
    
    try {
      await api.deletePage(id)
      setPages(pages.filter(page => page.id !== id))
    } catch (error) {
      console.error('Failed to delete page:', error)
    }
  }

  const filteredPages = selectedSection === 'all' 
    ? pages 
    : pages.filter(page => page.section_id.toString() === selectedSection)

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    return styles[status as keyof typeof styles] || styles.draft
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Pages Management</h1>
            </div>
            <Link
              href="/admin/pages/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Create New Page
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex items-center space-x-4">
          <div>
            <label htmlFor="section-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Section
            </label>
            <select
              id="section-filter"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="form-select"
            >
              <option value="all">All Sections</option>
              {sections.map(section => (
                <option key={section.id} value={section.id.toString()}>
                  {section.display_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pages Grid */}
        {filteredPages.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0122 34c4.21 0 7.863 2.613 9.288 6.286z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pages found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedSection === 'all' 
                ? 'Get started by creating your first page.'
                : 'No pages found in this section.'
              }
            </p>
            <div className="mt-6">
              <Link
                href="/admin/pages/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Create New Page
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map(page => (
              <div key={page.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {page.featured_image_url && (
                  <div className="h-48 bg-gray-200">
                    <img
                      src={page.featured_image_url}
                      alt={page.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {page.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {sections.find(s => s.id === page.section_id)?.display_name || 'Unknown Section'}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(page.status)}`}>
                      {page.status}
                    </span>
                  </div>

                  {page.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {page.excerpt}
                    </p>
                  )}

                  <div className="mt-4 text-xs text-gray-500">
                    Last updated: {new Date(page.updated_at).toLocaleDateString()}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      {page.is_published && (
                        <a
                          href={page.absolute_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-500 text-sm font-medium"
                        >
                          View
                        </a>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="text-red-600 hover:text-red-500 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Start Guide for Musicians */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Quick Start Guide for Musicians
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Essential Pages:</h4>
              <ul className="space-y-1">
                <li>• About - Your story and biography</li>
                <li>• Music - Discography and releases</li>
                <li>• Tours - Upcoming shows and events</li>
                <li>• Contact - How fans can reach you</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Pro Tips:</h4>
              <ul className="space-y-1">
                <li>• Use high-quality images for better engagement</li>
                <li>• Keep content fresh and updated regularly</li>
                <li>• Add SEO-friendly descriptions</li>
                <li>• Preview changes before publishing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 