This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zfts-web-portfolio.git
cd zfts-web-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `env.local.example` to `.env.local`
   - Update the following variables:
     - MongoDB connection settings
     - Admin credentials
     - SMTP settings for contact form
     - AWS S3 credentials for image uploads
     - JWT secret for authentication

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Portfolio Sections**
  - About Me
  - Skills & Experience
  - Projects
  - Contact Form

- **Blog System**
  - Terminal-style UI
  - Markdown support
  - Image uploads to AWS S3
  - Draft/Published post status
  - Secure admin interface

- **Authentication**
  - JWT-based auth
  - Secure cookie handling
  - Protected admin routes

## Technical Stack

- **Frontend**:
  - Next.js 13+
  - React 18
  - Tailwind CSS
  - Framer Motion
  - TypeScript

- **Backend**:
  - MongoDB
  - AWS S3
  - Next.js API Routes
  - JWT Authentication

- **DevOps**:
  - Docker support
  - Vercel deployment
  - Environment configuration

## Environment Variables

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net
MONGODB_DB=portfolio_blog

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key

# SMTP Configuration (Contact Form)
SMTP_HOST=your.smtp.host
SMTP_PORT=465
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
CONTACT_EMAIL=contact@yourdomain.com

# AWS S3 Configuration (Blog Images)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET_NAME=your-bucket-name
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
