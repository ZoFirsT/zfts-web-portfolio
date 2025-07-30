'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion } from 'framer-motion';

type BlogContentProps = {
  content: string;
  className?: string;
};

const optimizeCloudinaryUrl = (url: string): string => {
  if (url.includes('cloudinary.com')) {
    // Add Cloudinary transformation parameters for responsive images
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_auto,dpr_auto,c_limit/');
  }
  return url;
};

export default function BlogContent({ content, className = '' }: BlogContentProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`prose prose-invert max-w-none prose-sm sm:prose-base lg:prose-lg ${className}`}
      itemScope
      itemType="http://schema.org/Article"
    >
      <div 
        className="markdown-content text-sm sm:text-base"
        dangerouslySetInnerHTML={{ 
          __html: content
            // Add semantic HTML improvements with responsive classes
            .replace(/<h1/g, '<h1 class="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-accent"')
            .replace(/<h2/g, '<h2 class="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-textPrimary mt-6 sm:mt-8"')
            .replace(/<h3/g, '<h3 class="text-lg sm:text-xl font-bold mb-2 text-textPrimary mt-4 sm:mt-6"')
            // Optimize and enhance images
            .replace(
              /<img(.*?)src="(.*?)"(.*?)>/g, 
              (match, before, src, after) => {
                const optimizedSrc = optimizeCloudinaryUrl(src);
                return `<img${before}src="${optimizedSrc}"${after} loading="lazy" alt="Blog post image" class="rounded-lg shadow-lg my-3 sm:my-4 max-w-full h-auto" />`;
              }
            )
            // Make links more accessible
            .replace(
              /<a(.*?)href="(.*?)"(.*?)>/g,
              '<a$1href="$2"$3 rel="noopener noreferrer" class="text-accent hover:text-accent/80 transition-colors duration-200">'
            )
            // Enhance code blocks
            .replace(
              /<pre>/g,
              '<pre class="bg-secondary/30 p-3 sm:p-4 rounded-lg border border-accent/20 overflow-x-auto text-xs sm:text-sm">'
            )
            .replace(
              /<code>/g,
              '<code class="font-mono text-xs sm:text-sm">'
            )
            // Style blockquotes
            .replace(
              /<blockquote>/g,
              '<blockquote class="border-l-4 border-accent pl-3 sm:pl-4 my-3 sm:my-4 italic text-sm sm:text-base">'
            )
            // Style paragraphs
            .replace(
              /<p>/g,
              '<p class="mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">'
            )
            // Style lists
            .replace(
              /<ul>/g,
              '<ul class="list-disc pl-5 mb-3 sm:mb-4 space-y-1 sm:space-y-2">'
            )
            .replace(
              /<ol>/g,
              '<ol class="list-decimal pl-5 mb-3 sm:mb-4 space-y-1 sm:space-y-2">'
            )
            .replace(
              /<li>/g,
              '<li class="text-sm sm:text-base">'
            )
            // Style tables
            .replace(
              /<table>/g,
              '<table class="min-w-full border-collapse my-3 sm:my-4 text-xs sm:text-sm">'
            )
            .replace(
              /<th>/g,
              '<th class="border border-accent/20 bg-secondary/30 p-2 text-left">'
            )
            .replace(
              /<td>/g,
              '<td class="border border-accent/20 p-2">'
            )
        }}
      />
    </motion.article>
  );
}
