'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="h-screen flex relative flex-col text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="sectionTitle">Contact</h3>

      <div className="flex flex-col space-y-10">
        <h4 className="text-4xl font-semibold text-center">
          Let's Connect.{" "}
          <span className="decoration-accent/50 underline">Get In Touch</span>
        </h4>

        <div className="space-y-10">
          <div className="flex items-center space-x-5 justify-center">
            <EnvelopeIcon className="text-accent h-7 w-7 animate-pulse" />
            <p className="text-2xl">thanatcha.s@zfts.site</p>
          </div>

          <div className="flex items-center space-x-5 justify-center">
            <MapPinIcon className="text-accent h-7 w-7 animate-pulse" />
            <p className="text-2xl">Bangkok, Thailand</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-2 w-fit mx-auto">
          <div className="flex space-x-2">
            <input
              placeholder="Name"
              className="contactInput"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              placeholder="Email"
              className="contactInput"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <input
            placeholder="Subject"
            className="contactInput"
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />

          <textarea
            placeholder="Message"
            className="contactInput"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          />

          {status === 'error' && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          
          {status === 'success' && (
            <p className="text-green-500 text-sm">Message sent successfully! I'll get back to you soon.</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`bg-accent py-5 px-10 rounded-md text-primary font-bold text-lg transition-all duration-200 
              ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/80'}`}
          >
            {status === 'loading' ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
