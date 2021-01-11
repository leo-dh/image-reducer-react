import { h } from 'preact';
import { useState, useRef } from 'preact/compat';
import Tabs from '../components/Tabs';
import Slider from '../components/Slider';
import Preview from '../components/Preview';
import Layout from '../components/Layout';
import { COMPRESSION_MODE, CompressResults } from '../types';
import minifyAPI from '../services/minifyAPI';
import { defaultOptions } from '../imageprocessing/mozjpeg';
import createImageData from '../imageprocessing/createImageData';
import EncoderWorker from '../worker?worker';

function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [compressionMode, setCompressionMode] = useState(
    COMPRESSION_MODE.LOSSLESS,
  );
  const [offline, setOffline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompressResults[]>([]);
  const encoderWorkerRef = useRef<Worker | null>(null);

  const getEncoderWorker = async () => {
    if (!encoderWorkerRef.current) {
      const worker = await EncoderWorker();
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

  const checkForFile = (e: DragEvent) => {
    if (!e.dataTransfer) return false;
    return e.dataTransfer.types.includes('Files');
  };

  const submit = async () => {
    let promises;
    const worker = await getEncoderWorker();
    if (offline) {
      promises = images.map(async file => {
        try {
          worker.postMessage({
            file: await createImageData(file),
            options: defaultOptions,
          });
          worker.addEventListener(
            'message',
            e => {
              console.log(e.data);
            },
            { once: true },
          );
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
              <i>
                <svg
                  className="fill-current w-12 h-12 mb-3 text-purple-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
                </svg>
              </i>
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
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
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
