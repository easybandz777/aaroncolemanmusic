'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { api } from '@/lib/api'

interface ImageUploadProps {
  onUpload: (imageUrl: string, imageData: any) => void
  currentImage?: string
  label?: string
  accept?: string
  maxSize?: number
  className?: string
}

export default function ImageUpload({
  onUpload,
  currentImage,
  label = "Upload Image",
  accept = "image/*",
  maxSize = 5242880, // 5MB
  className = ""
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Upload to backend
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', file.name)
      formData.append('category', 'uploads')

      const response = await api.uploadMedia(file, {
        title: file.name,
        category: 'uploads'
      })

      const imageData = response.data
      onUpload(imageData.file, imageData)

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl)
    } catch (error: any) {
      console.error('Upload failed:', error)
      setError(error.response?.data?.message || 'Upload failed. Please try again.')
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
    }
  }, [maxSize, onUpload, currentImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    multiple: false,
    maxSize
  })

  const removeImage = () => {
    setPreview(null)
    setError(null)
    onUpload('', null)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {preview ? (
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
            <img
              src={preview}
              alt="Preview"
              className="h-48 w-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200" />
          </div>
          
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              type="button"
              onClick={removeImage}
              className="rounded-full bg-red-600 p-1.5 text-white shadow-lg hover:bg-red-700 transition-colors"
              title="Remove image"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-2 text-center">
            <button
              type="button"
              {...getRootProps()}
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              Change Image
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors
            ${isDragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-2">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="text-sm text-gray-600 mt-2">Uploading...</p>
              </div>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-gray-600">
                  <p className="text-sm font-medium">
                    {isDragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WebP up to {Math.round(maxSize / 1024 / 1024)}MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="ml-2 text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
} 