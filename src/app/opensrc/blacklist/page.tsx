'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCode, FaDownload, FaCopy, FaGithub } from 'react-icons/fa';
import BlacklistDownloader from '@/components/BlacklistDownloader';
import Link from 'next/link';

export default function BlacklistApiDocs() {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };
  
  const codeSnippets = {
    curl: `curl https://${process.env.NEXT_PUBLIC_VERCEL_URL || 'yourdomain.com'}/api/analytics/security/blacklist?format=json`,
    js: `fetch('https://${process.env.NEXT_PUBLIC_VERCEL_URL || 'yourdomain.com'}/api/analytics/security/blacklist?format=json')
  .then(response => response.json())
  .then(data => {
    console.log('Blacklisted IPs:', data);
    // Process the blacklist data
  })
  .catch(error => console.error('Error fetching blacklist:', error));`,
    python: `import requests

response = requests.get('https://${process.env.NEXT_PUBLIC_VERCEL_URL || 'yourdomain.com'}/api/analytics/security/blacklist?format=json')
if response.status_code == 200:
    blacklist = response.json()
    print(f"Retrieved {len(blacklist)} blacklisted IPs")
    # Process the blacklist data
else:
    print(f"Error: {response.status_code}")`,
    php: `<?php
$url = 'https://${process.env.NEXT_PUBLIC_VERCEL_URL || 'yourdomain.com'}/api/analytics/security/blacklist?format=json';
$response = file_get_contents($url);
$blacklist = json_decode($response, true);

if ($blacklist) {
    echo "Retrieved " . count($blacklist) . " blacklisted IPs\\n";
    // Process the blacklist data
}
?>`,
  };

  return (
    <div className="min-h-screen bg-primary text-white dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-2 border-b border-accent/20">
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-2xl text-accent" />
            <h2 className="text-xl font-bold">ZFTS Security</h2>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-textSecondary hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/#security-tools" className="text-textSecondary hover:text-accent transition-colors">
              Security Tools
            </Link>
            <Link href="/blog" className="text-textSecondary hover:text-accent transition-colors">
              Blog
            </Link>
            <Link href="/#contact" className="text-textSecondary hover:text-accent transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-bold mb-3 text-accent">Security IP Blacklist API</h1>
          <p className="text-xl text-textSecondary">
            Open Source Security Initiative
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div 
            className="bg-secondary/30 rounded-lg p-6 border border-accent/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4 text-accent">
              <FaShieldAlt className="text-2xl" />
              <h2 className="text-xl font-semibold">Free Access</h2>
            </div>
            <p className="text-textSecondary">
              No authentication required. Our security data is free to use under the CC-BY-SA-4.0 license.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-secondary/30 rounded-lg p-6 border border-accent/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4 text-accent">
              <FaCode className="text-2xl" />
              <h2 className="text-xl font-semibold">Multiple Formats</h2>
            </div>
            <p className="text-textSecondary">
              Available in TXT, JSON, CSV, and server-ready Apache & Nginx configurations.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-secondary/30 rounded-lg p-6 border border-accent/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4 text-accent">
              <FaGithub className="text-2xl" />
              <h2 className="text-xl font-semibold">Open Source</h2>
            </div>
            <p className="text-textSecondary">
              Share, adapt, and contribute. Help us build a safer internet together.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-12"
        >
          <BlacklistDownloader 
            title="Download IP Blacklist" 
            className="mb-8"
          />
          
          <div className="bg-secondary/30 rounded-lg p-6 border border-accent/20">
            <h2 className="text-2xl font-semibold mb-6 text-textPrimary">API Documentation</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2 text-accent">Endpoint</h3>
              <div className="bg-black/30 p-3 rounded flex justify-between items-center">
                <code className="text-green-400">
                  GET /api/analytics/security/blacklist?format=[FORMAT]
                </code>
                <button 
                  onClick={() => copyToClipboard('/api/analytics/security/blacklist?format=json', 'endpoint')}
                  className="text-accent hover:text-accent/80"
                >
                  {copiedSnippet === 'endpoint' ? 'Copied!' : <FaCopy />}
                </button>
              </div>
              
              <div className="mt-4">
                <p className="font-medium mb-1">Available formats:</p>
                <ul className="list-disc pl-6 text-textSecondary space-y-1">
                  <li><code className="bg-black/20 px-1 rounded">txt</code> - Plain text list</li>
                  <li><code className="bg-black/20 px-1 rounded">json</code> - JSON formatted data</li>
                  <li><code className="bg-black/20 px-1 rounded">csv</code> - CSV for spreadsheets</li>
                  <li><code className="bg-black/20 px-1 rounded">apache</code> - Apache server config</li>
                  <li><code className="bg-black/20 px-1 rounded">nginx</code> - Nginx server config</li>
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-accent">Code Examples</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">cURL</span>
                    <button 
                      onClick={() => copyToClipboard(codeSnippets.curl, 'curl')}
                      className="text-accent hover:text-accent/80"
                    >
                      {copiedSnippet === 'curl' ? 'Copied!' : <FaCopy />}
                    </button>
                  </div>
                  <pre className="bg-black/30 p-3 rounded overflow-x-auto">
                    <code className="text-green-400">
                      {codeSnippets.curl}
                    </code>
                  </pre>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">JavaScript</span>
                    <button 
                      onClick={() => copyToClipboard(codeSnippets.js, 'js')}
                      className="text-accent hover:text-accent/80"
                    >
                      {copiedSnippet === 'js' ? 'Copied!' : <FaCopy />}
                    </button>
                  </div>
                  <pre className="bg-black/30 p-3 rounded overflow-x-auto">
                    <code className="text-green-400">
                      {codeSnippets.js}
                    </code>
                  </pre>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Python</span>
                    <button 
                      onClick={() => copyToClipboard(codeSnippets.python, 'python')}
                      className="text-accent hover:text-accent/80"
                    >
                      {copiedSnippet === 'python' ? 'Copied!' : <FaCopy />}
                    </button>
                  </div>
                  <pre className="bg-black/30 p-3 rounded overflow-x-auto">
                    <code className="text-green-400">
                      {codeSnippets.python}
                    </code>
                  </pre>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">PHP</span>
                    <button 
                      onClick={() => copyToClipboard(codeSnippets.php, 'php')}
                      className="text-accent hover:text-accent/80"
                    >
                      {copiedSnippet === 'php' ? 'Copied!' : <FaCopy />}
                    </button>
                  </div>
                  <pre className="bg-black/30 p-3 rounded overflow-x-auto">
                    <code className="text-green-400">
                      {codeSnippets.php}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-secondary/30 rounded-lg p-6 border border-accent/20 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-textPrimary">License & Usage</h2>
          <p className="mb-4 text-textSecondary">
            This security data is provided under the Creative Commons Attribution-ShareAlike 4.0 
            International License (CC-BY-SA-4.0). You are free to share and adapt the material
            for any purpose, including commercially, as long as you give appropriate credit and 
            distribute your contributions under the same license.
          </p>
          
          <div className="bg-black/30 p-4 rounded">
            <h3 className="font-medium mb-2 text-accent">Required Attribution</h3>
            <code className="text-sm text-green-400">
              Security data provided by ZFTS Open Source Security Initiative (https://zfts.com)
              under the CC-BY-SA-4.0 license.
            </code>
            <button 
              onClick={() => copyToClipboard('Security data provided by ZFTS Open Source Security Initiative (https://zfts.com) under the CC-BY-SA-4.0 license.', 'attribution')}
              className="block mt-2 text-accent hover:text-accent/80"
            >
              {copiedSnippet === 'attribution' ? 'Copied!' : <span className="flex items-center gap-1"><FaCopy /> Copy attribution</span>}
            </button>
          </div>
        </motion.div>
        
        <div className="text-center">
          <Link href="/" className="text-accent hover:text-accent/80 underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
