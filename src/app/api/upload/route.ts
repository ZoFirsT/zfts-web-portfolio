import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToS3 } from '@/lib/s3';
import { uploadLocal } from '@/lib/storage';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const key = new TextEncoder().encode(secretKey);

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'blog-images');

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authToken = cookies().get('auth-token');
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await jwtVerify(authToken.value, key);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      try {
        await mkdir(UPLOAD_DIR, { recursive: true });
      } catch (err) {
        console.error('Failed to create upload directory:', err);
        return NextResponse.json({ 
          error: 'Server configuration error, please contact administrator' 
        }, { status: 500 });
      }
    }

    const formData = await request.formData();
    const file = formData.get('file') as any;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Get file extension and generate unique name
    const fileType = file.type.split('/')[1];
    const fileName = `blog-images/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileType}`;

    // Always use local storage for now since S3 is not configured
    try {
      const result = await uploadLocal(file, fileName);
      return NextResponse.json({ 
        ...result,
        message: 'Image uploaded and optimized successfully'
      });
    } catch (error) {
      console.error('Error handling file upload:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to upload file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in upload handler:', error);
    return NextResponse.json(
      { error: 'Failed to process upload request' },
      { status: 500 }
    );
  }
}
