/* eslint-disable @typescript-eslint/ban-ts-comment */
import mozjpegModule, { MozJPEGModule } from './codecs/mozjpeg/mozjpeg_enc';
import * as Comlink from 'comlink/dist/esm/comlink.min.js';
import { MozjpegEncode } from './types';

let mozjpeg: MozJPEGModule;

const locateFile = () => {
  //@ts-ignore
  if (import.meta.env.MODE === 'development')
    return './codecs/mozjpeg/mozjpeg_enc.wasm';
  else return './mozjpeg_enc.wasm';
};

const createBlob = (arrayBuffer: ArrayBuffer, mimetype: string) => {
  const bytes = new Uint8Array(arrayBuffer);
  const blob = new Blob([bytes.buffer], { type: mimetype });
  return blob;
};

const mozjpegEncode: MozjpegEncode = async (data, options, mimetype) => {
  if (!mozjpeg) {
    mozjpeg = await mozjpegModule({
      locateFile,
    });
  }
  const encodedResult = mozjpeg.encode(
    data.data,
    data.width,
    data.height,
    options,
  );
  const blob = createBlob(encodedResult, mimetype);
  return blob;
};

Comlink.expose({
  mozjpegEncode,
});
