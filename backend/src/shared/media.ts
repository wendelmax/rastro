declare function require(name: string): unknown;

export interface MediaPresigner {
  createUploadUrl(input: { userId: string; contentType: string; sizeBytes: number }): Promise<{ uploadUrl: string; key: string }>;
}

export class S3MediaPresigner implements MediaPresigner {
  async createUploadUrl(input: { userId: string; contentType: string; sizeBytes: number }): Promise<{ uploadUrl: string; key: string }> {
    const bucket = process.env.MEDIA_BUCKET;
    if (!bucket) throw new Error('MEDIA_BUCKET is not configured');
    const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3') as {
      PutObjectCommand: new (input: Record<string, unknown>) => unknown;
      S3Client: new (config: { region?: string }) => unknown;
    };
    const { getSignedUrl } = require('@aws-sdk/s3-request-presigner') as {
      getSignedUrl: (client: unknown, command: unknown, options: { expiresIn: number }) => Promise<string>;
    };
    const key = `users/${input.userId}/${crypto.randomUUID()}`;
    const uploadUrl = await getSignedUrl(new S3Client({ region: process.env.AWS_REGION }), new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: input.contentType,
      ContentLength: input.sizeBytes,
    }), { expiresIn: 300 });
    return { uploadUrl, key };
  }
}
