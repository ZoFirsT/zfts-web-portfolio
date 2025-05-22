import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

interface UploadResult {
  url: string;
  width: number;
  height: number;
}

export async function uploadFileToS3(file: any, customKey?: string): Promise<UploadResult> {
  // Validate file size
  const fileBuffer = file.buffer || await file.arrayBuffer();
  if (fileBuffer.byteLength > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }

  // Validate file type
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are supported');
  }

  try {
    // Process image with Sharp
    const image = sharp(Buffer.from(fileBuffer));
    const metadata = await image.metadata();
    
    // Resize if too large while maintaining aspect ratio
    if (metadata.width && metadata.width > 1920) {
      image.resize(1920, undefined, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Convert to WebP for better compression
    const processedBuffer = await image
      .webp({ quality: 80 })
      .toBuffer();

    // Determine S3 key and file URL
    const key = customKey || `blog-images/${uuidv4()}.webp`;
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: processedBuffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000', // Cache for 1 year
    };

    await s3Client.send(new PutObjectCommand(params));

    // Get final dimensions
    const finalMetadata = await sharp(processedBuffer).metadata();
    
    // Construct the URL based on region and bucket
    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-southeast-1'}.amazonaws.com/${key}`;
    
    return {
      url,
      width: finalMetadata.width || 0,
      height: finalMetadata.height || 0
    };
  } catch (error) {
    console.error('Error processing/uploading to S3:', error);
    throw error;
  }
}
