import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
const cloudConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Check if any config is missing
if (!cloudConfig.cloud_name || !cloudConfig.api_key || !cloudConfig.api_secret) {
  console.error('Missing Cloudinary configuration:', {
    hasCloudName: Boolean(cloudConfig.cloud_name),
    hasApiKey: Boolean(cloudConfig.api_key),
    hasApiSecret: Boolean(cloudConfig.api_secret),
  });
}

cloudinary.config(cloudConfig);

export interface UploadResult {
  url: string;
  width: number;
  height: number;
  format: string;
  publicId: string;
}

export async function uploadToCloudinary(file: any): Promise<UploadResult> {
  try {
    // Basic validation
    if (!file) {
      throw new Error('No file provided');
    }
    
    // Log Cloudinary configuration status
    console.log('Cloudinary configuration:', {
      cloudName: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
      apiKey: Boolean(process.env.CLOUDINARY_API_KEY),
      apiSecret: Boolean(process.env.CLOUDINARY_API_SECRET)
    });

    // Convert file to base64
    const fileBuffer = file.buffer || await file.arrayBuffer();
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = `data:${file.type};base64,${base64Data}`;

    // Use the most basic upload configuration possible
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'blog-images' 
    });

    // Return the result
    return {
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}
