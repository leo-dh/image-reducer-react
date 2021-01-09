import createBlob from '../imageprocessing/createBlob';
import createImageData from '../imageprocessing/createImageData';
import { encode } from '../imageprocessing/mozjpeg';

export default async function mozjpegEncode(file: File) {
  try {
    const imageData = await createImageData(file);
    const encodedResult = await encode(imageData);
    const blob = createBlob(encodedResult, file.type);
    return blob;
  } catch (err) {
    console.error(err);
  }
}
