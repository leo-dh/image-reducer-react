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
  Tooltip,
} from '../components';
import { CompressionMode, CompressResults, EncoderWorker } from '../types';
import minifyAPI from '../services/minifyAPI';
import {
  fileToImageData,
  FILE_SIZE_LIMIT,
  imageDataToBlob,
} from '../imageprocessing/utils';
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
      if (
        file.size < FILE_SIZE_LIMIT &&
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
      state.files.splice(action.deleteIndex!, 1);
      return {
        ...state,
      };

    case ReducerActionType.SET_QUALITY: {
      let quality = ~~action.quality!;
      if (quality > 100) {
        quality = 100;
      } else if (quality < 1) {
        quality = 1;
      }
      return {
        ...state,
        quality,
      };
    }

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
  compressionMode: CompressionMode.LOSSY,
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

  const getEncoderWorker = () => {
    if (!encoderWorkerRef.current) {
      const worker = Comlink.wrap<EncoderWorker>(new WorkerModule());
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
    let promises: Promise<void>[];
    if (state.compressionMode === CompressionMode.LOSSY && state.offline) {
      const worker = getEncoderWorker();
      promises = state.files.map(async file => {
        try {
          const imageData = await fileToImageData(file);
          let result = await worker.encode(imageData, state.quality, file.type);
          if (result instanceof ImageData) {
            result = await imageDataToBlob(result);
          }
          const value: CompressResults = {
            filename: file.name,
            initialSize: file.size.toString(),
            finalSize: result.size.toString(),
            url: URL.createObjectURL(result),
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
      <div className="flex flex-col items-center text-center mt-8 md:mt-12">
        <h1 className="font-roboto text-3xl md:text-5xl mb-6 md:mb-10 ">
          <span className="font-light">Compress images with</span> <br />
          <span className="font-black text-purple-500">your browser</span>
        </h1>
        <p className="bg-white shadow px-3 py-1 rounded text-gray-600 text-sm md:text-base">
          Avoid sending your images to an unknown server
        </p>
      </div>
      <div className="w-full h-full flex flex-col justify-start mt-12 md:mt-20">
        <div className="flex w-full flex-col lg:flex-row">
          <div className="flex flex-col flex-1 flex-grow-2">
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
              className="mb-2 sm:p-2"
            />
            {state.compressionMode === CompressionMode.LOSSY && (
              <>
                <Tabs<string>
                  activeValue={state.offline ? 'Browser' : 'Server'}
                  values={['Browser', 'Server']}
                  callback={arg => {
                    dispatch({
                      type: ReducerActionType.SET_OFFLINE,
                      offline: arg === 'Browser',
                    });
                  }}
                  info={
                    <FormLabel>
                      <span className="flex">
                        <span className="mr-1">AGENT</span>
                        <Tooltip />:
                      </span>
                    </FormLabel>
                  }
                  className="mb-2 sm:p-2 flex"
                />
                <Slider
                  callback={arg => {
                    dispatch({
                      type: ReducerActionType.SET_QUALITY,
                      quality: arg,
                    });
                  }}
                  value={state.quality}
                  info={<FormLabel>QUALITY :</FormLabel>}
                  className="mb-4 sm:p-2"
                />
              </>
            )}
          </div>

          <DragAndDrop
            className="border-dashed border-2 border-gray-400 rounded-md py-12 flex flex-col justify-center items-center pointer-events-auto flex-1 flex-grow-3"
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
        </div>
        <h3 className="mt-16 mb-3 font-bold sm:text-lg text-gray-900">
          Image Compress Queue
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
                  // TODO Might need to add a tooltip to warn if the finalsize is larger than the initialsize.
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
    </Layout>
  );
}

export default Home;
