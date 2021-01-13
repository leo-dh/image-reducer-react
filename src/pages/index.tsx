/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { h, Fragment } from 'preact';
import { useRef, useReducer, useEffect } from 'preact/compat';
import * as Comlink from 'comlink';
import {
  DragAndDrop,
  FormLabel,
  Layout,
  Preview,
  Slider,
  Tabs,
  LoadingIcon,
  DownloadIcon,
} from '../components';
import { CompressionMode, CompressResults, EncoderWorker } from '../types';
import minifyAPI from '../services/minifyAPI';
import { defaultOptions } from '../imageprocessing/mozjpeg';
import createImageData from '../imageprocessing/createImageData';
import WorkerModule from '../worker?worker';

interface ReducerState {
  files: File[];
  quality: number;
  compressionMode: CompressionMode;
  offline: boolean;
  result: CompressResults[];
  loading: boolean;
}

enum ReducerActionType {
  UPLOAD_FILES,
  DELETE_FILE,
  SET_QUALITY,
  SET_COMPRESSION_MODE,
  SET_OFFLINE,
  COMPRESSING_IMAGE,
  UPDATE_RESULTS,
  FINISHED_CONVERSION,
}

interface ReducerAction extends Partial<ReducerState> {
  type: ReducerActionType;
  deleteIndex?: number;
}

const filterFiles = (files: File[]) => {
  return files
    .filter(file => {
      // TODO create a constant for file limit and put it in a file
      if (
        file.size < 30 * 1024 * 1024 &&
        /image\/(jpg|jpeg|png)/.exec(file.type)
      ) {
        return true;
      }
      return false;
    })
    .slice(0, 10);
};

const reducer = (state: ReducerState, action: ReducerAction): ReducerState => {
  switch (action.type) {
    case ReducerActionType.UPLOAD_FILES: {
      const files = filterFiles([...state.files, ...action.files!]);
      return {
        ...state,
        files,
      };
    }

    case ReducerActionType.DELETE_FILE:
      return {
        ...state,
        files: state.files.splice(action.deleteIndex!, 1),
      };

    case ReducerActionType.SET_QUALITY:
      return {
        ...state,
        quality: action.quality!,
      };

    case ReducerActionType.SET_COMPRESSION_MODE:
      return {
        ...state,
        compressionMode: action.compressionMode!,
      };

    case ReducerActionType.SET_OFFLINE:
      return {
        ...state,
        offline: action.offline!,
      };

    case ReducerActionType.COMPRESSING_IMAGE:
      return {
        ...state,
        loading: true,
      };

    case ReducerActionType.UPDATE_RESULTS: {
      const [file] = action.files!;
      state.files.splice(state.files.indexOf(file), 1);
      return {
        ...state,
        result: [...state.result, ...action.result!],
      };
    }

    case ReducerActionType.FINISHED_CONVERSION:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

const initialState: ReducerState = {
  files: [],
  quality: 80,
  compressionMode: CompressionMode.LOSSLESS,
  offline: true,
  loading: false,
  result: [],
};

function Home() {
  const [state, dispatch] = useReducer<ReducerState, ReducerAction>(
    reducer,
    initialState,
  );
  const encoderWorkerRef = useRef<Comlink.Remote<EncoderWorker> | null>(null);
  useEffect(() => {
    return () => {
      if (encoderWorkerRef.current) {
        encoderWorkerRef.current.terminate();
      }
    };
  }, []);

  const getEncoderWorker = async () => {
    if (!encoderWorkerRef.current) {
      const worker = Comlink.wrap<EncoderWorker>(await WorkerModule());
      encoderWorkerRef.current = worker;
      return worker;
    } else {
      return encoderWorkerRef.current;
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    const href = await fetch(url)
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob));
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const submit = async () => {
    // TODO Add compression mode logic
    let promises;
    const worker = await getEncoderWorker();
    if (state.offline) {
      promises = state.files.map(async file => {
        try {
          const blob = await worker.mozjpegEncode(
            await createImageData(file),
            defaultOptions,
            file.type,
          );
          const value: CompressResults = {
            filename: file.name,
            initialSize: file.size.toString(),
            finalSize: blob.size.toString(),
            url: URL.createObjectURL(blob),
          };
          dispatch({
            type: ReducerActionType.UPDATE_RESULTS,
            result: [value],
            files: [file],
          });
        } catch (err) {
          console.error(err);
        }
      });
    } else {
      promises = state.files.map(async file => {
        try {
          const res = await minifyAPI(
            file,
            state.compressionMode,
            state.quality,
          );
          const value = await res.json();
          dispatch({
            type: ReducerActionType.UPDATE_RESULTS,
            result: [value],
            files: [file],
          });
        } catch (err) {
          console.error(err);
        }
      });
    }
    return Promise.allSettled(promises);
  };

  return (
    <Layout>
      <div className="flex">
        <div className="p-8 w-full h-full flex flex-col">
          <h1 className="text-center text-3xl text-purple-500 font-extrabold mb-12">
            Minify Images
          </h1>
          <Tabs<CompressionMode>
            activeValue={state.compressionMode}
            values={Object.values(CompressionMode)}
            callback={arg => {
              dispatch({
                type: ReducerActionType.SET_COMPRESSION_MODE,
                compressionMode: arg,
              });
            }}
            info={<FormLabel>MODE :</FormLabel>}
            className="mb-4 sm:p-2"
          />
          {state.compressionMode === CompressionMode.LOSSY && (
            <Slider
              callback={arg => {
                dispatch({ type: ReducerActionType.SET_QUALITY, quality: arg });
              }}
              value={state.quality}
              info={
                <h3 className="font-extrabold mr-4 min-w-8ch">QUALITY: </h3>
              }
              className="mb-4 sm:p-2"
            />
          )}
          <DragAndDrop
            className="border-dashed border-2 border-gray-400 rounded-md py-12 flex flex-col justify-center items-center pointer-events-auto"
            setFilesCallback={arg => {
              dispatch({
                type: ReducerActionType.UPLOAD_FILES,
                files: arg,
              });
            }}
          >
            {inputRef => (
              <>
                <p className="mb-1 font-bold text-gray-900 flex flex-wrap justify-center">
                  Drag and drop your images here
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Accepts jpeg, png. Max 30mb.
                </p>
                <button
                  type="button"
                  className="mt-2 rounded-md px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none font-semibold text-gray-800"
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                >
                  Upload image
                </button>
              </>
            )}
          </DragAndDrop>
          <h3 className="pt-8 pb-3 font-bold sm:text-lg text-gray-900">
            Uploaded Images
          </h3>
          <Preview
            deleteCallback={arg => {
              dispatch({
                type: ReducerActionType.DELETE_FILE,
                deleteIndex: arg,
              });
            }}
            files={state.files}
          />
          <div className="pt-8 flex justify-end">
            <button
              type="submit"
              className={`mt-2 rounded-md px-3 py-1 bg-purple-500 text-white flex items-center disabled:opacity-50  focus:shadow-outline focus:outline-none transition-colors duration-300 font-semibold ${
                state.loading
                  ? 'cursor-not-allowed'
                  : 'hover:bg-gray-300 hover:text-black cursor-pointer'
              }`}
              onClick={async () => {
                if (state.files.length === 0) return;
                dispatch({ type: ReducerActionType.COMPRESSING_IMAGE });
                try {
                  await submit();
                } catch (err) {
                  console.log('HELLO');
                  console.error(err);
                }
                dispatch({ type: ReducerActionType.FINISHED_CONVERSION });
              }}
              disabled={state.loading}
            >
              {state.loading && (
                <LoadingIcon
                  className="animate-spin h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                />
              )}
              {state.loading ? 'Compressing' : 'Submit'}
            </button>
          </div>
          {state.result.length > 0 && (
            <div className="flex flex-col">
              <h3 className="pt-8 pb-3 font-bold sm:text-lg text-gray-900">
                Results
              </h3>
              <ul className="flex flex-wrap bg-gray-100 rounded-md p-2">
                {state.result.map(
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
                          onClick={() => {
                            downloadFile(url, filename);
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
