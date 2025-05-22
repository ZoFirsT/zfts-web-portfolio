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

export default function BlogContent({ content, className = '' }: BlogContentProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`prose prose-invert max-w-none ${className}`}
      itemScope
      itemType="http://schema.org/Article"
    >
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ 
          __html: content
            // Add semantic HTML improvements
            .replace(/<h1/g, '<h1 class="text-3xl font-bold mb-4 text-accent"')
            .replace(/<h2/g, '<h2 class="text-2xl font-bold mb-3 text-textPrimary mt-8"')
            .replace(/<h3/g, '<h3 class="text-xl font-bold mb-2 text-textPrimary mt-6"')
            // Make images more SEO-friendly
            .replace(
              /<img(.*?)src="(.*?)"(.*?)>/g, 
              '<img$1src="$2"$3 loading="lazy" alt="Blog post image" class="rounded-lg shadow-lg my-4" />'
            )
            // Make links more accessible
            .replace(
              /<a(.*?)href="(.*?)"(.*?)>/g,
              '<a$1href="$2"$3 rel="noopener noreferrer" class="text-accent hover:text-accent/80 transition-colors duration-200">'
            )
            // Enhance code blocks
            .replace(
              /<pre>/g,
              '<pre class="bg-secondary/30 p-4 rounded-lg border border-accent/20 overflow-x-auto">'
            )
            .replace(
              /<code>/g,
              '<code class="font-mono text-sm">'
            )
            // Style blockquotes
            .replace(
              /<blockquote>/g,
              '<blockquote class="border-l-4 border-accent/50 pl-4 italic text-textSecondary my-4">'
            )
        }}
      />
    </motion.article>
  );
}
