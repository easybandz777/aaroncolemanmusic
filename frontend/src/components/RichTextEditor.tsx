'use client'

import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  label?: string
  placeholder?: string
  height?: number
  className?: string
}

export default function RichTextEditor({
  value,
  onChange,
  label = "Content",
  placeholder = "Start writing...",
  height = 400,
  className = ""
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null)

  const handleEditorChange = (content: string) => {
    onChange(content)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="border border-gray-300 rounded-md overflow-hidden">
        <Editor
          apiKey="your-tinymce-api-key" // You'll need to get this from TinyMCE
          onInit={(evt, editor) => editorRef.current = editor}
          value={value}
          onEditorChange={handleEditorChange}
          init={{
            height: height,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: `
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                font-size: 14px;
                line-height: 1.6;
                color: #374151;
              }
              h1, h2, h3, h4, h5, h6 {
                color: #111827;
                font-weight: 600;
                margin-top: 1.5em;
                margin-bottom: 0.5em;
              }
              p {
                margin-bottom: 1em;
              }
              a {
                color: #3B82F6;
                text-decoration: none;
              }
              a:hover {
                text-decoration: underline;
              }
              img {
                max-width: 100%;
                height: auto;
                border-radius: 0.375rem;
              }
              blockquote {
                border-left: 4px solid #E5E7EB;
                padding-left: 1rem;
                margin: 1.5rem 0;
                font-style: italic;
                color: #6B7280;
              }
              ul, ol {
                padding-left: 1.5rem;
                margin-bottom: 1rem;
              }
              li {
                margin-bottom: 0.25rem;
              }
            `,
            placeholder: placeholder,
            skin: 'oxide',
            content_css: 'default',
            branding: false,
            resize: 'vertical',
            statusbar: false,
            browser_spellcheck: true,
            contextmenu: false,
            setup: (editor) => {
              editor.on('focus', () => {
                editor.getContainer().style.borderColor = '#3B82F6'
              })
              editor.on('blur', () => {
                editor.getContainer().style.borderColor = '#D1D5DB'
              })
            }
          }}
        />
      </div>
      
      <p className="text-xs text-gray-500">
        Use the toolbar above to format your content. You can add links, lists, and emphasis.
      </p>
    </div>
  )
} 