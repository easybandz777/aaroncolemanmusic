'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { ContentSection } from '@/types'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import RichTextEditor from '@/components/RichTextEditor'

export default function NewPage() {
  const router = useRouter()
  const [sections, setSections] = useState<ContentSection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    status: 'draft',
    content: '',
    excerpt: '',
    section_id: '',
    template_name: 'default',
    requires_auth: false,
    featured_image: '',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    robots_txt: 'index, follow',
    og_title: '',
    og_description: ''
  })

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    try {
      const response = await api.getSections()
      setSections(response.data.results || response.data || [])
    } catch (error) {
      console.error('Failed to load sections:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))

    // Auto-generate slug from title
    if (name === 'title' && !formData.slug) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-')
      setFormData(prev => ({ ...prev, slug }))
    }

    // Auto-generate meta title from title
    if (name === 'title' && !formData.meta_title) {
      setFormData(prev => ({ ...prev, meta_title: value }))
    }
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
  }

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, featured_image: imageUrl }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.createPage(formData)
      router.push('/admin/pages')
    } catch (error: any) {
      console.error('Failed to create page:', error)
      alert(error.response?.data?.message || 'Failed to create page')
    } finally {
      setIsLoading(false)
    }
  }

  const templates = [
    { value: 'default', label: 'Default Page' },
    { value: 'landing', label: 'Landing Page' },
    { value: 'about', label: 'About Page' },
    { value: 'music', label: 'Music Page' },
    { value: 'gallery', label: 'Gallery Page' },
    { value: 'contact', label: 'Contact Page' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/pages"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Pages
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Create New Page</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="form-label">Page Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="form-input"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., About Aaron Coleman"
                />
              </div>

              <div>
                <label htmlFor="slug" className="form-label">URL Slug *</label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  required
                  className="form-input"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="e.g., about-aaron-coleman"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL: aaroncolemanmusic.com/{formData.slug || 'page-url'}
                </p>
              </div>

              <div>
                <label htmlFor="section_id" className="form-label">Section *</label>
                <select
                  id="section_id"
                  name="section_id"
                  required
                  className="form-select"
                  value={formData.section_id}
                  onChange={handleInputChange}
                >
                  <option value="">Select a section...</option>
                  {sections.map(section => (
                    <option key={section.id} value={section.id}>
                      {section.display_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="template_name" className="form-label">Page Template</label>
                <select
                  id="template_name"
                  name="template_name"
                  className="form-select"
                  value={formData.template_name}
                  onChange={handleInputChange}
                >
                  {templates.map(template => (
                    <option key={template.value} value={template.value}>
                      {template.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requires_auth"
                  name="requires_auth"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  checked={formData.requires_auth}
                  onChange={handleInputChange}
                />
                <label htmlFor="requires_auth" className="ml-2 text-sm text-gray-700">
                  Requires login to view
                </label>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="excerpt" className="form-label">Page Summary</label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                className="form-textarea"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief description of this page (used for previews and SEO)"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Featured Image</h2>
            <ImageUpload
              onUpload={handleImageUpload}
              currentImage={formData.featured_image}
              label="Upload a featured image for this page"
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Content</h2>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write your page content here..."
              height={500}
            />
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">SEO Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="meta_title" className="form-label">Meta Title</label>
                <input
                  type="text"
                  id="meta_title"
                  name="meta_title"
                  className="form-input"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  placeholder="Title for search engines (recommended: 50-60 characters)"
                />
              </div>

              <div>
                <label htmlFor="meta_description" className="form-label">Meta Description</label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  rows={3}
                  className="form-textarea"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  placeholder="Description for search engines (recommended: 150-160 characters)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="og_title" className="form-label">Social Media Title</label>
                  <input
                    type="text"
                    id="og_title"
                    name="og_title"
                    className="form-input"
                    value={formData.og_title}
                    onChange={handleInputChange}
                    placeholder="Title when shared on social media"
                  />
                </div>

                <div>
                  <label htmlFor="robots_txt" className="form-label">Robots Directive</label>
                  <select
                    id="robots_txt"
                    name="robots_txt"
                    className="form-select"
                    value={formData.robots_txt}
                    onChange={handleInputChange}
                  >
                    <option value="index, follow">Index, Follow</option>
                    <option value="noindex, follow">No Index, Follow</option>
                    <option value="index, nofollow">Index, No Follow</option>
                    <option value="noindex, nofollow">No Index, No Follow</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="og_description" className="form-label">Social Media Description</label>
                <textarea
                  id="og_description"
                  name="og_description"
                  rows={2}
                  className="form-textarea"
                  value={formData.og_description}
                  onChange={handleInputChange}
                  placeholder="Description when shared on social media"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/pages"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Page'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 