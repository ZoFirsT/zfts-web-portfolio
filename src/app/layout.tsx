import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thanatcha Saleekongchai | Full Stack Developer & Cloud DevOps Engineer",
  description: "Experienced Full Stack Developer and Cloud DevOps Engineer specializing in web development, cloud architecture, and DevOps practices. View my portfolio, projects, and technical expertise.",
  keywords: "Full Stack Developer, Cloud DevOps Engineer, Web Development, React, TypeScript, Node.js, AWS, Docker, Kubernetes",
  authors: [{ name: "Thanatcha Saleekongchai" }],
  creator: "Thanatcha Saleekongchai",
  publisher: "Thanatcha Saleekongchai",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zfts-web-portfolio.vercel.app/",
    title: "Thanatcha Saleekongchai | Full Stack Developer & Cloud DevOps Engineer",
    description: "Experienced Full Stack Developer and Cloud DevOps Engineer specializing in web development, cloud architecture, and DevOps practices.",
    siteName: "Thanatcha Saleekongchai Portfolio",
    images: [
      {
        url: "/profile-image.jpeg",
        width: 800,
        height: 600,
        alt: "Thanatcha Saleekongchai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thanatcha Saleekongchai | Full Stack Developer & Cloud DevOps Engineer",
    description: "Experienced Full Stack Developer and Cloud DevOps Engineer specializing in web development, cloud architecture, and DevOps practices.",
    images: ["/profile-image.jpeg"],
    creator: "@thanatchadev",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-primary`}>
        {children}
      </body>
    </html>
  );
}
