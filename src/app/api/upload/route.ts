import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToS3 } from '@/lib/s3';
import { uploadLocal } from '@/lib/storage';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const key = new TextEncoder().encode(secretKey);

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = cookies().get('auth-token');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await jwtVerify(token.value, key);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
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

    // Determine storage method
    const useS3 = process.env.USE_S3_STORAGE === 'true' && process.env.AWS_S3_BUCKET_NAME;
    
    let result;
    if (useS3) {
      result = await uploadFileToS3(file);
    } else {
      result = await uploadLocal(file);
    }

    return NextResponse.json({ 
      ...result,
      message: `Image uploaded and optimized successfully using ${useS3 ? 'S3' : 'local'} storage`
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
