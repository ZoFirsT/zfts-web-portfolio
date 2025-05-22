'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  FaBold, FaItalic, FaListUl, FaListOl, FaQuoteLeft, 
  FaLink, FaImage, FaUndo, FaRedo 
} from 'react-icons/fa';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [isDragging, setIsDragging] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your content here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { url } = await response.json();
      editor.chain().focus().setImage({ src: url }).run();
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleImageUpload(file);
    }
  };

  return (
    <div 
      className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden relative ${
        isDragging ? 'ring-2 ring-blue-500' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center backdrop-blur-sm z-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-blue-500">
            <p className="text-blue-500 font-medium">Drop image here</p>
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 p-3 border-b border-gray-300 dark:border-gray-600">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
              editor.isActive('bold') ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white' : ''
            }`}
            title="Bold"
          >
            <FaBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
              editor.isActive('italic') ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white' : ''
            }`}
            title="Italic"
          >
            <FaItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
              editor.isActive('bulletList') ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white' : ''
            }`}
            title="Bullet List"
          >
            <FaListUl />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
              editor.isActive('orderedList') ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white' : ''
            }`}
            title="Numbered List"
          >
            <FaListOl />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
              editor.isActive('blockquote') ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white' : ''
            }`}
            title="Quote"
          >
            <FaQuoteLeft />
          </button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
          <button
            onClick={() => {
              const url = window.prompt('Enter link URL:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
              editor.isActive('link') ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white' : ''
            }`}
            title="Add Link"
          >
            <FaLink />
          </button>
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileInputChange}
            />
            <div
              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
                isDragging ? 'bg-blue-100 dark:bg-blue-900/20' : ''
              }`}
              title="Add Image (Click or Drag & Drop)"
            >
              <FaImage />
            </div>
          </label>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-40"
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <FaUndo />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-40"
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <FaRedo />
          </button>
        </div>
      </div>
      <EditorContent 
        editor={editor} 
        className={`prose dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
          isDragging ? 'opacity-50' : ''
        }`}
      />
    </div>
  );
}
