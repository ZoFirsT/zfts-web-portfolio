'use client';

import { GlobeAltIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

type Language = {
  code: string;
  name: string;
  flag: string;
};

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');

  const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-textSecondary hover:text-accent transition-colors duration-200"
        >
          <GlobeAltIcon className="h-6 w-6" />
          <span>{languages.find(lang => lang.code === selectedLang)?.flag}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-secondary ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLang(lang.code);
                    setIsOpen(false);
                  }}
                  className={`${
                    selectedLang === lang.code ? 'bg-accent/10 text-accent' : 'text-textSecondary'
                  } group flex w-full items-center px-4 py-2 text-sm hover:bg-accent/5 transition-colors duration-200`}
                  role="menuitem"
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
