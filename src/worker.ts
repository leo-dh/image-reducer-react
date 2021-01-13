/* eslint-disable @typescript-eslint/ban-ts-comment */
import mozjpegModule, { MozJPEGModule } from './codecs/mozjpeg/mozjpeg_enc';
import imagequantModule, {
  QuantizerModule,
} from './codecs/imagequant/imagequant';
import * as Comlink from 'comlink/dist/esm/comlink.min.js';
import { MozjpegEncode, ImagequantEncode } from './types';

let mozjpeg: MozJPEGModule;
let imagequant: QuantizerModule;

const mozjpegLocateFile = () => {
  //@ts-ignore
  if (import.meta.env.MODE === 'development')
    return './codecs/mozjpeg/mozjpeg_enc.wasm';
  return './mozjpeg_enc.wasm';
};

const imagequantLocateFile = () => {
  //@ts-ignore
  if (import.meta.env.MODE === 'development')
    return './codecs/imagequant/imagequant.wasm';
  return './imagequant.wasm';
};

const createBlob = (arrayBuffer: ArrayBuffer, mimetype: string) => {
  const bytes = new Uint8Array(arrayBuffer);
  const blob = new Blob([bytes.buffer], { type: mimetype });
  return blob;
};

// TODO Maybe return it as ImageData? Might be easier to process when returning to main thread
const mozjpegEncode: MozjpegEncode = async (data, options, mimetype) => {
  if (!mozjpeg) {
    mozjpeg = await mozjpegModule({ locateFile: mozjpegLocateFile });
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

const imagequantEncode: ImagequantEncode = async (data, options) => {
  if (!imagequant) {
    imagequant = await imagequantModule({ locateFile: imagequantLocateFile });
  }
  const encodedResult = imagequant.quantize(
    data.data,
    data.width,
    data.height,
    options.numColors,
    options.dither,
  );
  return new ImageData(
    new Uint8ClampedArray(encodedResult.buffer),
    data.width,
    data.height,
  );
};

Comlink.expose({
  mozjpegEncode,
  imagequantEncode,
});
