import { useEffect } from 'react';

interface BlogMetadataProps {
  title: string;
  description: string;
  author?: string;
  date: string;
  url: string;
  image?: string;
  tags?: string[];
  canonical?: string;
}

export default function BlogMetadata({
  title,
  description,
  author = "Thanatcha Saleekongchai",
  date,
  url,
  image,
  tags = [],
  canonical
}: BlogMetadataProps) {
  useEffect(() => {
    // Update page metadata
    document.title = `${title} | ZFTS Blog`;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Create JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: description,
      author: {
        '@type': 'Person',
        name: author
      },
      datePublished: date,
      dateModified: date,
      image: image || '/logoMain.png',
      url: url,
      publisher: {
        '@type': 'Organization',
        name: 'ZFTS Blog',
        logo: {
          '@type': 'ImageObject',
          url: '/logoMain.png'
        }
      },
      keywords: tags.join(', ')
    };

    let scriptTag = document.querySelector('#json-ld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script') as HTMLScriptElement;
      scriptTag.id = 'json-ld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLd);

    // Add canonical URL
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalTag) {
      canonicalTag = document.createElement('link') as HTMLLinkElement;
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonical || url);

    // Update OpenGraph tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:url': url,
      'og:type': 'article',
      'og:image': image || '/logoMain.png',
      'article:published_time': date,
      'article:author': author,
      'article:tag': tags.join(',')
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

    // Update Twitter Card tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image || '/logoMain.png'
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

    // Clean up function
    return () => {
      const script = document.querySelector('#json-ld');
      if (script) script.remove();
    };
  }, [title, description, author, date, url, image, tags]);

  return null;
}
