/**
 * TypeScript type definitions for the CMS
 * 
 * This file contains all the type definitions used throughout the CMS
 * including API responses, form data, and component props.
 */

export interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  full_name: string
  email?: string
}

export interface ContentSection {
  id: number
  name: string
  slug: string
  section_type: 'home' | 'about' | 'services' | 'blog' | 'contact' | 'custom'
  description: string
  is_active: boolean
  order: number
  show_in_nav: boolean
  nav_title: string
  display_name: string
  page_count: number
  created_at: string
  updated_at: string
}

export interface Page {
  id: number
  title: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  content: string
  excerpt: string
  featured_image: string | null
  featured_image_url: string | null
  section: ContentSection
  section_id: number
  template_name: string
  author: User
  published_at: string | null
  requires_auth: boolean
  custom_css: string
  custom_js: string
  is_published: boolean
  absolute_url: string
  // SEO fields
  meta_title: string
  meta_description: string
  canonical_url: string
  robots_txt: string
  og_title: string
  og_description: string
  og_image: string | null
  // Timestamps
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  content: string
  excerpt: string
  featured_image: string | null
  featured_image_url: string | null
  tags: string
  tag_list: string[]
  category: string
  author: User
  published_at: string | null
  scheduled_for: string | null
  allow_comments: boolean
  is_featured: boolean
  read_time_minutes: number
  is_published: boolean
  absolute_url: string
  // SEO fields
  meta_title: string
  meta_description: string
  canonical_url: string
  robots_txt: string
  og_title: string
  og_description: string
  og_image: string | null
  // Timestamps
  created_at: string
  updated_at: string
}

export interface ContentBlock {
  id: number
  name: string
  block_type: 'text' | 'image' | 'video' | 'gallery' | 'testimonial' | 'cta' | 'custom'
  identifier: string
  title: string
  content: string
  image: string | null
  image_url: string | null
  url: string
  button_text: string
  is_active: boolean
  css_classes: string
  usage_count: number
  created_at: string
  updated_at: string
}

export interface MediaFile {
  id: number
  title: string
  description: string
  file: string
  file_type: 'image' | 'document' | 'video' | 'audio' | 'other'
  file_size: number
  mime_type: string
  category: any
  tags: string
  tag_list: string[]
  alt_text: string
  caption: string
  uploaded_by: User
  uploaded_at: string
  updated_at: string
  download_count: number
  is_public: boolean
  file_extension: string
  file_size_human: string
}

// Form data types
export interface LoginForm {
  username: string
  password: string
}

export interface PageForm {
  title: string
  slug?: string
  status: 'draft' | 'published' | 'archived'
  content: string
  excerpt: string
  section_id: number
  template_name: string
  requires_auth: boolean
  custom_css: string
  custom_js: string
  meta_title: string
  meta_description: string
  canonical_url: string
  robots_txt: string
  og_title: string
  og_description: string
}

export interface BlogPostForm {
  title: string
  slug?: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  content: string
  excerpt: string
  tags: string
  category: string
  scheduled_for?: string
  allow_comments: boolean
  is_featured: boolean
  read_time_minutes: number
  meta_title: string
  meta_description: string
  canonical_url: string
  robots_txt: string
  og_title: string
  og_description: string
}

export interface ContentSectionForm {
  name: string
  slug?: string
  section_type: 'home' | 'about' | 'services' | 'blog' | 'contact' | 'custom'
  description: string
  is_active: boolean
  order: number
  show_in_nav: boolean
  nav_title: string
}

export interface ContentBlockForm {
  name: string
  identifier?: string
  block_type: 'text' | 'image' | 'video' | 'gallery' | 'testimonial' | 'cta' | 'custom'
  title: string
  content: string
  url: string
  button_text: string
  is_active: boolean
  css_classes: string
}

// API response types
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Component prop types
export interface AdminLayoutProps {
  children: any
  title?: string
}

export interface DashboardStatsProps {
  pages: number
  blogPosts: number
  sections: number
  contentBlocks: number
}

// Utility types
export type SortDirection = 'asc' | 'desc'
export type FilterOption = {
  label: string
  value: string | number
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => any
}

export interface SearchFilters {
  search?: string
  status?: string
  section?: string
  category?: string
  author?: string
  page?: number
  ordering?: string
} 