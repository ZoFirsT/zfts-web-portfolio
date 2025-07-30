import fs from 'fs';
import path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import { FaShieldAlt, FaGithub, FaDownload } from 'react-icons/fa';
import Link from 'next/link';

export const metadata = {
  title: 'DDoS Protection Documentation | ZFTS Security',
  description: 'Comprehensive documentation on DDoS protection measures implemented in the ZFTS Web Portfolio application.',
};

async function getDocContent() {
  const filePath = path.join(process.cwd(), 'src/content/ddos-protection.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(fileContent);
  
  return processedContent.toString();
}

export default async function SecurityDocsPage() {
  const content = await getDocContent();
  
  return (
    <div className="min-h-screen bg-primary text-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-2 border-b border-accent/20">
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-2xl text-accent" />
            <h2 className="text-xl font-bold">ZFTS Security</h2>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-textSecondary hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/admin/security" className="text-textSecondary hover:text-accent transition-colors">
              Security Dashboard
            </Link>
            <Link href="/opensrc/blacklist" className="text-textSecondary hover:text-accent transition-colors">
              Blacklist API
            </Link>
          </nav>
        </div>
        
        {/* Documentation */}
        <div className="bg-secondary/30 rounded-lg p-6 border border-accent/20 mb-8">
          <div className="prose prose-invert max-w-none prose-headings:text-accent prose-a:text-accent hover:prose-a:text-accent/80 prose-code:bg-black/30 prose-code:p-1 prose-code:rounded prose-pre:bg-black/30 prose-pre:p-4 prose-pre:rounded-lg" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link 
            href="/opensrc/blacklist" 
            className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors"
          >
            <FaDownload /> Access Blacklist API
          </Link>
          
          <a 
            href="https://github.com/zFts-Dev/zfts-web-portfolio" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-secondary/40 text-accent border border-accent/30 rounded-lg hover:bg-secondary/60 transition-colors"
          >
            <FaGithub /> Contribute on GitHub
          </a>
        </div>
      </div>
    </div>
  );
} 