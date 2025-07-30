'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaCloud, FaUpload, FaTerminal, FaLock, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function CloudinaryTest() {
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isPinVerifying, setIsPinVerifying] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);

  // Check if user was previously authenticated in this session
  useEffect(() => {
    const authStatus = sessionStorage.getItem('cloudinary_test_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    // Check if we're on localhost
    const hostname = window.location.hostname;
    setIsLocalhost(hostname === 'localhost' || hostname === '127.0.0.1');
  }, []);

  const checkConfig = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cloudinary-test');
      const data = await response.json();
      setConfigStatus(data);
      toast.success('Config check completed');
    } catch (error) {
      console.error('Error checking config:', error);
      toast.error('Failed to check config');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload-test', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      setUploadResult(data);
      toast.success('Test upload successful!');
    } catch (error) {
      console.error('Upload test error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is locked due to too many attempts
    if (isLocked) {
      toast.error('Too many incorrect attempts. Please try again later.');
      return;
    }
    
    try {
      setIsPinVerifying(true);
      
      const response = await fetch('/api/auth/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'cloudinary_test_pin',
          pin
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('cloudinary_test_auth', 'true');
        toast.success('Access granted');
        setAttempts(0);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        // Handle rate limiting (HTTP 429)
        if (response.status === 429) {
          setIsLocked(true);
          toast.error('Too many attempts. Access temporarily locked.');
          
          // Reset lock after 1 minute
          setTimeout(() => {
            setIsLocked(false);
            setAttempts(0);
          }, 60 * 1000);
        } else {
          toast.error(`Incorrect PIN. Please try again.`);
        }
        
        setPin('');
      }
    } catch (error) {
      console.error('PIN verification error:', error);
      toast.error('Failed to verify PIN. Please try again.');
      setPin('');
    } finally {
      setIsPinVerifying(false);
    }
  };

  // If not on localhost, show a message
  if (!isLocalhost) {
    return (
      <div className="min-h-screen bg-primary text-white dark:bg-slate-900 flex items-center justify-center p-4">
        <motion.div 
          className="bg-secondary/30 p-8 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <FaLock className="text-3xl text-accent" />
            <h1 className="text-2xl font-bold text-textPrimary">Access Restricted</h1>
          </div>
          
          <p className="text-textSecondary mb-6">
            This section is only accessible from localhost for development and testing purposes.
          </p>
          
          <div className="p-4 bg-black/20 rounded-lg border border-red-500/30 mb-6">
            <p className="text-red-400">
              For security reasons, test routes can only be accessed from a local development environment.
            </p>
          </div>
          
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors"
          >
            Return to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  // If not authenticated, show PIN entry screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary text-white dark:bg-slate-900 flex items-center justify-center">
        <motion.div 
          className="bg-secondary/30 p-8 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <FaLock className="text-3xl text-accent" />
            <h1 className="text-2xl font-bold text-textPrimary">Protected Area</h1>
          </div>
          
          <p className="text-textSecondary mb-6">
            Please enter the PIN to access the Cloudinary test page.
          </p>
          
          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              maxLength={10}
              className="w-full p-3 mb-4 bg-black/20 border border-accent/30 rounded-lg text-white focus:outline-none focus:border-accent"
              disabled={isLocked || isPinVerifying}
            />
            
            <button
              type="submit"
              disabled={isLocked || isPinVerifying || !pin}
              className="w-full py-3 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors disabled:bg-gray-600 disabled:text-gray-300"
            >
              {isLocked ? 'Access Locked' : isPinVerifying ? 'Verifying...' : 'Submit'}
            </button>
          </form>
          
          {isLocked && (
            <p className="mt-4 text-red-400 text-sm">
              Too many incorrect attempts. Please try again later.
            </p>
          )}
          
          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
            >
              Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto p-8">
        {/* Terminal Header */}
        <motion.div 
          className="flex items-center gap-2 mb-4 p-2 bg-secondary/30 rounded-t-lg border-b border-accent/20"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div className="flex items-center gap-4 ml-2">
            <span className="text-textSecondary text-sm">zfts-terminal -- Cloudinary Test</span>
            <span className="text-accent/50">|</span>
            <Link 
              href="/"
              className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
            >
              cd ~
            </Link>
            <span className="text-accent/50">|</span>
            <Link 
              href="/admin"
              className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
            >
              cd /admin
            </Link>
            <span className="text-accent/50">|</span>
            <button
              onClick={() => {
                sessionStorage.removeItem('cloudinary_test_auth');
                setIsAuthenticated(false);
              }}
              className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Localhost Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center gap-2"
        >
          <FaInfoCircle className="text-yellow-500 flex-shrink-0" />
          <p className="text-sm text-yellow-200">
            This page is only accessible from localhost for security reasons. API endpoints used by this page are also restricted to localhost access.
          </p>
        </motion.div>

        {/* Dashboard Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-3"
        >
          <FaCloud className="text-3xl text-accent" />
          <div>
            <h1 className="text-2xl font-bold text-textPrimary">Cloudinary Configuration Test</h1>
            <p className="text-textSecondary">Verify your Cloudinary integration</p>
          </div>
        </motion.div>
        
        <div className="space-y-8">
          <motion.section 
            className="bg-secondary/30 p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-accent/20">
              <FaTerminal className="text-xl text-accent" />
              <h2 className="text-xl font-semibold">1. Check Configuration</h2>
            </div>
            
            <button
              onClick={checkConfig}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded hover:bg-accent/80 disabled:bg-gray-600 disabled:text-gray-300 transition-colors"
            >
              {isLoading ? 'Checking...' : 'Check Cloudinary Config'}
            </button>
            
            {configStatus && (
              <div className="mt-4 p-4 bg-black/30 rounded border border-accent/20">
                <h3 className="font-medium text-accent mb-2">Configuration Status:</h3>
                <pre className="text-textSecondary overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(configStatus, null, 2)}
                </pre>
              </div>
            )}
          </motion.section>
          
          <motion.section 
            className="bg-secondary/30 p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-accent/20">
              <FaUpload className="text-xl text-accent" />
              <h2 className="text-xl font-semibold">2. Test Upload</h2>
            </div>
            
            <div>
              <label className="block mb-2 text-textSecondary">
                Select image to upload:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="mt-2 block w-full text-sm text-textSecondary file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-accent/80 file:text-black hover:file:bg-accent/70 file:cursor-pointer"
                />
              </label>
            </div>
            
            {uploadResult && (
              <div className="mt-4">
                <h3 className="font-medium text-accent mb-2">Upload Result:</h3>
                <pre className="p-4 bg-black/30 rounded border border-accent/20 text-textSecondary overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(uploadResult, null, 2)}
                </pre>
                
                {uploadResult.url && (
                  <div className="mt-4">
                    <h4 className="font-medium text-accent mb-2">Uploaded Image:</h4>
                    <div className="p-2 bg-black/20 rounded-lg border border-accent/20">
                      <img 
                        src={uploadResult.url} 
                        alt="Uploaded test image" 
                        className="max-w-full h-auto max-h-64 rounded-lg mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
