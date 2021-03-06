import mozjpegModule, { MozJPEGModule } from './codecs/mozjpeg/mozjpeg_enc';
import imagequantModule, {
  QuantizerModule,
} from './codecs/imagequant/imagequant';
import * as Comlink from 'comlink/dist/esm/comlink.min.js';
import { Encode } from './types';
import {
  defaultOptions as mozjpegDefaultOptions,
  MozjpegOptions,
} from './imageprocessing/mozjpeg';
import {
  defaultOptions as imagequantDefaultOptions,
  ImagequantOptions,
} from './imageprocessing/imagequant';

let mozjpeg: MozJPEGModule;
let imagequant: QuantizerModule;

const isPng = (mimetype: string) => {
  return /image\/png/.exec(mimetype);
};

const mozjpegLocateFile = () => {
  if (import.meta.env.MODE === 'development')
    return './codecs/mozjpeg/mozjpeg_enc.wasm';
  return './mozjpeg_enc.wasm';
};

const imagequantLocateFile = () => {
  if (import.meta.env.MODE === 'development')
    return './codecs/imagequant/imagequant.wasm';
  return './imagequant.wasm';
};

const createBlob = (arrayBuffer: ArrayBuffer, mimetype: string) => {
  const bytes = new Uint8Array(arrayBuffer);
  const blob = new Blob([bytes.buffer], { type: mimetype });
  return blob;
};

const mozjpegEncode = async (
  data: ImageData,
  options: MozjpegOptions,
  mimetype: string,
) => {
  if (!mozjpeg) {
    mozjpeg = await mozjpegModule({
      locateFile: mozjpegLocateFile,
      noInitialRun: true,
    });
  }
  const encodedResult = mozjpeg.encode(
    data.data,
    data.width,
    data.height,
    options,
  );
  return createBlob(encodedResult.buffer, mimetype);
};

const imagequantEncode = async (
  data: ImageData,
  options: ImagequantOptions,
) => {
  if (!imagequant) {
    imagequant = await imagequantModule({
      locateFile: imagequantLocateFile,
      noInitialRun: true,
    });
  }
  const encodedResult = imagequant.quantize(
    data.data,
    data.width,
    data.height,
    options,
  );
  return new ImageData(
    new Uint8ClampedArray(encodedResult.buffer),
    data.width,
    data.height,
  );
};

const encode: Encode = (imageData, quality, mimetype) => {
  if (isPng(mimetype)) {
    const options = imagequantDefaultOptions;
    [options.min_quality, options.max_quality] = [~~(0.85 * quality), quality];
    return imagequantEncode(imageData, options);
  } else {
    const options = mozjpegDefaultOptions;
    options.quality = quality;
    return mozjpegEncode(imageData, options, mimetype);
  }
};

Comlink.expose({
  encode,
});
