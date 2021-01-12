import { CompressionMode } from '../types';

const BACKEND_URL = '/api/minify';

export default function minifyAPI(
  file: File,
  compressionMode: CompressionMode,
  quality: number,
) {
  const formData = new FormData();
  formData.append('image', file);

  const url = `${BACKEND_URL}${
    compressionMode === CompressionMode.LOSSY
      ? `?${new URLSearchParams({ quality: quality.toString() })}`
      : ''
  }`;
  return fetch(url, {
    method: 'POST',
    body: formData,
  });
}
