# Test Routes

## Overview

This directory contains test pages and utilities that are only accessible from localhost environments. These pages are designed for development and testing purposes only and are not intended for production use.

## Security Restrictions

All routes under `/test` are protected by the following security measures:

1. **Localhost-only Access**: Pages and API endpoints in this directory can only be accessed from `localhost` or `127.0.0.1`. Attempts to access these routes from any other domain will be blocked.

2. **PIN Authentication**: Some test pages (like the Cloudinary test) require a PIN for access, providing an additional layer of security.

## Available Test Pages

- `/test/cloudinary`: Test page for Cloudinary integration, allowing you to verify your Cloudinary configuration and test file uploads.

## API Endpoints

The following API endpoints are available for test purposes:

- `/api/cloudinary-test`: Checks Cloudinary configuration
- `/api/upload-test`: Tests file uploads to Cloudinary

## Development Notes

- The PIN for test pages can be configured in your `.env.local` file using the `CLOUDINARY_TEST_PIN` variable.
- All test routes are automatically excluded from production builds.
- If you need to add a new test route, make sure to follow the same security pattern used in existing test routes.

## Implementation Details

- Security is enforced at the middleware level in `src/middleware.ts`
- Helper functions for localhost-only access are available in `src/app/api/test/error.ts` 