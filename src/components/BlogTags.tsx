'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiX } from 'react-icons/hi';

interface Tag {
  id: string;
  name: string;
}

interface BlogTagsProps {
  selectedTags: Tag[];
  onChange?: (tags: Tag[]) => void;
  onTagClick?: (tagName: string) => void;
  activeTag?: string | null;
  editable?: boolean;
  className?: string;
}

export default function BlogTags({ 
  selectedTags, 
  onChange, 
  onTagClick,
  activeTag = null,
  editable = false, 
  className = '' 
}: BlogTagsProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (!onChange || !inputValue.trim()) return;
    
    // Check if tag already exists
    const tagExists = selectedTags.some(
      tag => tag.name.toLowerCase() === inputValue.trim().toLowerCase()
    );
    
    if (tagExists) {
      setInputValue('');
      return;
    }

    // Create new tag
    const newTag = {
      id: Date.now().toString(),
      name: inputValue.trim()
    };

    onChange([...selectedTags, newTag]);
    setInputValue('');
  };

  const handleRemoveTag = (id: string) => {
    if (!onChange) return;
    onChange(selectedTags.filter(tag => tag.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className={`flex flex-wrap gap-1 xs:gap-2 items-center ${className}`}>
      {selectedTags.map(tag => (
        <div 
          key={tag.id}
          className={`inline-flex items-center px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md text-xs xs:text-sm transition-all duration-200 ${
            activeTag === tag.name 
              ? 'bg-accent text-primary font-semibold shadow-md' 
              : 'bg-secondary/30 text-textPrimary hover:bg-secondary/50'
          } ${
            editable ? 'pr-1' : ''
          }`}
        >
          {editable ? (
            <>
              <span>{tag.name}</span>
              <button 
                onClick={() => handleRemoveTag(tag.id)}
                className="ml-1 p-0.5 xs:p-1 hover:bg-secondary/50 rounded-full text-textSecondary"
                aria-label={`Remove ${tag.name} tag`}
              >
                <HiX size={12} />
              </button>
            </>
          ) : onTagClick ? (
            // Custom click handler for tag selection
            <span 
              onClick={() => onTagClick(tag.name)}
              className="cursor-pointer"
            >
              {tag.name}
            </span>
          ) : (
            // Default behavior linking to blog with tag filter
            <Link href={`/blog?tag=${encodeURIComponent(tag.name)}`}>
              <span>{tag.name}</span>
            </Link>
          )}
        </div>
      ))}
      
      {editable && (
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add tag..."
            className="bg-primary border border-gray-300 dark:border-gray-700 rounded-l-md px-2 py-1 text-xs xs:text-sm w-16 xs:w-24 focus:outline-none focus:border-accent"
          />
          <button
            onClick={handleAddTag}
            className="bg-accent text-primary px-1.5 xs:px-2 py-1 rounded-r-md text-xs xs:text-sm hover:bg-accent/80 transition-colors"
            disabled={!inputValue.trim()}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
