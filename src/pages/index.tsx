import { h } from 'preact';
import { useState, useRef } from 'preact/compat';
import * as Comlink from 'comlink';
import Tabs from '../components/Tabs';
import Slider from '../components/Slider';
import Preview from '../components/Preview';
import Layout from '../components/Layout';
import { COMPRESSION_MODE, CompressResults, EncoderWorker } from '../types';
import minifyAPI from '../services/minifyAPI';
import { defaultOptions } from '../imageprocessing/mozjpeg';
import createImageData from '../imageprocessing/createImageData';
import WorkerModule from '../worker?worker';
import {
  DownloadIcon,
  LoadingIcon,
  UploadCloudIcon,
} from '../components/Icons';

const checkForFile = (e: DragEvent) => {
  if (!e.dataTransfer) return false;
  return e.dataTransfer.types.includes('Files');
};

function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [compressionMode, setCompressionMode] = useState(
    COMPRESSION_MODE.LOSSLESS,
  );
  const [offline, setOffline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompressResults[]>([]);
  const encoderWorkerRef = useRef<Comlink.Remote<EncoderWorker> | null>(null);

  const getEncoderWorker = async () => {
    if (!encoderWorkerRef.current) {
      const worker = Comlink.wrap<EncoderWorker>(await WorkerModule());
      encoderWorkerRef.current = worker;
      return worker;
    } else {
      return encoderWorkerRef.current;
    }
  };

  const filterFiles = (fileList: FileList) => {
    setImages(oldValue => {
      const newValue = [...oldValue];
      const limits = Math.min(10 - newValue.length, fileList.length);
      for (let i = 0; i < limits; i++) {
        const element = fileList[i];
        if (
          element.size < 30 * 1024 * 1024 &&
          /image\/(jpg|jpeg|png)/.exec(element.type)
        ) {
          newValue.push(element);
        }
      }
      return newValue;
    });
  };

  const deleteFile = (index: number) => {
    setImages(oldValue => {
      const newValue = [...oldValue];
      newValue.splice(index, 1);
      return newValue;
    });
  };

  const submit = async () => {
    let promises;
    const worker = await getEncoderWorker();
    if (offline) {
      promises = images.map(async file => {
        try {
          const blob = await worker.mozjpegEncode(
            await createImageData(file),
            defaultOptions,
            file.type,
          );
          console.log(blob);
        } catch (err) {
          console.error(err);
        }
      });
    } else {
      promises = images.map(async file => {
        try {
          const res = await minifyAPI(file, compressionMode, quality);
          const value = await res.json();
          setResult(oldValue => {
            const newValue = [...oldValue, value];
            return newValue;
          });
        } catch (err) {
          console.error(err);
        }
      });
    }
    return promises;
  };

  return (
    <Layout>
      <div className="flex">
        <div className="p-8 w-full h-full flex flex-col">
          <h1 className="text-center text-3xl text-purple-500 font-extrabold mb-12">
            Minify Images
          </h1>
          <Tabs<COMPRESSION_MODE>
            activeValue={compressionMode}
            values={Object.values(COMPRESSION_MODE)}
            callback={setCompressionMode}
            info={<h3 className="font-extrabold mr-4 min-w-8ch">MODE: </h3>}
            className="mb-4 sm:p-2"
          />
          {compressionMode === COMPRESSION_MODE.LOSSY && (
            <Slider
              callback={setQuality}
              value={quality}
              info={
                <h3 className="font-extrabold mr-4 min-w-8ch">QUALITY: </h3>
              }
              className="mb-4 sm:p-2"
            />
          )}
          <div
            className="border-dashed border-2 border-gray-400 rounded-md py-12 flex flex-col justify-center items-center relative"
            onDrop={e => {
              e.preventDefault();
              if (!e.dataTransfer) return;
              overlayRef.current?.classList.replace('opacity-100', 'opacity-0');
              const { files } = e.dataTransfer;
              filterFiles(files);
            }}
            onDragOver={e => {
              if (checkForFile(e)) e.preventDefault();
            }}
            onDragEnter={e => {
              e.preventDefault();
              if (checkForFile(e)) {
                overlayRef.current?.classList.replace(
                  'opacity-0',
                  'opacity-100',
                );
              }
            }}
            onDragLeave={e => {
              if (checkForFile(e)) {
                overlayRef.current?.classList.replace(
                  'opacity-100',
                  'opacity-0',
                );
              }
            }}
          >
            <div
              id="overlay"
              className="w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex-col items-center justify-center rounded-md flex bg-white bg-opacity-90 opacity-0 transition-opacity duration-300"
              ref={overlayRef}
            >
              <UploadCloudIcon
                className="w-12 h-12 mb-3 text-purple-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              />
              <p className="text-lg text-purple-500">Drop files to upload</p>
            </div>
            <p className="mb-1 font-bold text-gray-900 flex flex-wrap justify-center">
              Drag and drop your images here
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Accepts jpeg, png. Max 30mb.
            </p>
            <input
              id="hidden-input"
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              ref={inputRef}
              onInput={e => {
                const files = (e.target as HTMLInputElement).files;
                if (files) filterFiles(files);
              }}
            />
            <button
              type="button"
              className="mt-2 rounded-md px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none font-semibold text-gray-800"
              onClick={() => {
                inputRef.current?.click();
              }}
            >
              Upload image
            </button>
          </div>

          <h3 className="pt-8 pb-3 font-bold sm:text-lg text-gray-900">
            Uploaded Images
          </h3>
          <Preview deleteCallback={deleteFile} files={images} />
          <div className="pt-8 flex justify-end">
            <button
              type="submit"
              className={`mt-2 rounded-md px-3 py-1 bg-purple-500 text-white flex items-center disabled:opacity-50  focus:shadow-outline focus:outline-none transition-colors duration-300 font-semibold ${
                loading
                  ? 'cursor-not-allowed'
                  : 'hover:bg-gray-300 hover:text-black cursor-pointer'
              }`}
              onClick={async () => {
                if (images.length === 0) return;
                setLoading(true);
                const responses = await submit();
                responses && (await Promise.all(responses));
                setImages([]);
                setLoading(false);
              }}
              disabled={loading}
            >
              {loading && (
                <LoadingIcon
                  className="animate-spin h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                />
              )}
              {loading ? 'Submitting' : 'Submit'}
            </button>
          </div>
          {result.length > 0 && (
            <div className="flex flex-col">
              <h3 className="pt-8 pb-3 font-bold sm:text-lg text-gray-900">
                Results
              </h3>
              <ul className="flex flex-wrap bg-gray-100 rounded-md p-2">
                {result.map(
                  ({ filename, finalSize, initialSize, url }, index) => (
                    <Preview.Card
                      filename={filename}
                      filesize={Number(finalSize)}
                      imgSrc={url}
                      index={index}
                      key={url}
                      ctaButton={() => (
                        <button
                          type="button"
                          className="ml-auto focus:outline-none hover:bg-gray-900 p-1 rounded-md transition-colors duration-300"
                          onClick={async () => {
                            const href = await fetch(url)
                              .then(response => response.blob())
                              .then(blob => URL.createObjectURL(blob));
                            const link = document.createElement('a');
                            link.href = href;
                            link.download = filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <DownloadIcon
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            className="h-4 w-4"
                          />
                        </button>
                      )}
                    />
                  ),
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
