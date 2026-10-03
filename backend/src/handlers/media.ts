import { S3MediaPresigner, type MediaPresigner } from '../shared/media';
import { errorResponse, jsonResponse, parseBody, requireUserId, type HttpApiEvent, type HttpResponse } from '../shared/http';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function handleMedia(event: HttpApiEvent, presigner: MediaPresigner = new S3MediaPresigner()): Promise<HttpResponse> {
  try {
    const userId = requireUserId(event);
    const input = parseBody<{ contentType?: string; sizeBytes?: number }>(event);
    if (!input.contentType || !ALLOWED_TYPES.has(input.contentType) || !input.sizeBytes || input.sizeBytes <= 0 || input.sizeBytes > MAX_IMAGE_BYTES) {
      return jsonResponse(400, { message: 'unsupported media type or size' });
    }
    return jsonResponse(200, await presigner.createUploadUrl({
      userId,
      contentType: input.contentType,
      sizeBytes: input.sizeBytes,
    }));
  } catch (error) {
    return errorResponse(error);
  }
}
