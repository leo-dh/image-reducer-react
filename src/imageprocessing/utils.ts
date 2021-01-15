export const FILE_SIZE_LIMIT = 30 * 1024 * 1024;

export async function fileToImageData(file: File) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  // const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  [canvas.width, canvas.height] = [bitmap.width, bitmap.height];
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Cannot get canvas context.');
  context.drawImage(bitmap, 0, 0);
  return context.getImageData(0, 0, bitmap.width, bitmap.height);
}

export async function imageDataToBlob(
  imageData: ImageData,
  mimetype = 'image/png',
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  [canvas.width, canvas.height] = [imageData.width, imageData.height];
  const context = canvas.getContext('2d');
  context?.putImageData(imageData, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject('Blob is null');
    }, mimetype);
  });
}
