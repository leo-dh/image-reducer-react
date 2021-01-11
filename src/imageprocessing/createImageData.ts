export default async function createImageData(file: File) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  // const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Cannot get canvas context.');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  context.drawImage(bitmap, 0, 0);
  return context.getImageData(0, 0, bitmap.width, bitmap.height);
}
