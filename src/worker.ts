import mozjpegModule, { MozJPEGModule } from './codecs/mozjpeg/mozjpeg_enc';

declare let self: Worker;
let mozjpeg: MozJPEGModule;

const createBlob = (arrayBuffer: ArrayBuffer, mimetype: string) => {
  const bytes = new Uint8Array(arrayBuffer);
  const blob = new Blob([bytes.buffer], { type: mimetype });
  return blob;
};

self.addEventListener('message', async e => {
  if (!mozjpeg) {
    mozjpeg = await mozjpegModule({
      locateFile: () => './mozjpeg_enc.wasm',
    });
  }
  const imageData = e.data.file;
  const encodedResult = mozjpeg.encode(
    imageData.data,
    imageData.width,
    imageData.height,
    e.data.options,
  );
  const blob = createBlob(encodedResult, e.data.file.type);
  self.postMessage({ result: blob });
});
