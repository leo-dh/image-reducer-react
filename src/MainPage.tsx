import React, { useState, useRef } from "react";
import Tabs from "./components/Tabs";

enum COMPRESSION_MODE {
  LOSSLESS = "LOSSLESS",
  LOSSY = "LOSSY",
}

function MainPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState(new FormData());
  const [quality, setQuality] = useState(80);
  const [compressionMode, setCompressionMode] = useState(
    COMPRESSION_MODE.LOSSLESS
  );

  const filterFiles = (fileList: FileList) => {
    setFormData((oldValue) => {
      const newValue = new FormData();
      const images = oldValue.getAll("images");
      images.forEach((value) => {
        newValue.append("images", value);
      });
      const limits = Math.min(10 - images.length, fileList.length);
      for (let i = 0; i < limits; i++) {
        const element = fileList[i];
        if (
          element.size < 30 * 1024 * 1024 &&
          element.type.match(/image\/(jpg|jpeg|png)/)
        ) {
          newValue.append("images", element);
        }
      }
      return newValue;
    });
  };

  const deleteFile = (index: number) => {
    setFormData((oldValue) => {
      const newValue = new FormData();
      const images = oldValue.getAll("images");
      images.splice(index, 1);
      images.forEach((value) => {
        newValue.append("images", value);
      });
      return newValue;
    });
  };

  return (
    <div className="flex">
      <div className="p-8 w-full h-full flex flex-col">
        <h1 className="text-center text-3xl text-purple-500 font-bold mb-12">
          Minify Images
        </h1>
        <Tabs<COMPRESSION_MODE>
          activeValue={compressionMode}
          values={Object.values(COMPRESSION_MODE)}
          callback={setCompressionMode}
          info={<h3 className="font-bold ml-4 mr-8 min-w-8ch">MODE: </h3>}
          className="mb-4 p-2"
        />
        {compressionMode === COMPRESSION_MODE.LOSSY && (
          <div className="mb-4 flex items-center w-min p-2">
            <h3 className="font-bold ml-4 mr-8">QUALITY: </h3>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={quality}
              onChange={(e) => {
                setQuality(Number(e.target.value));
              }}
              className="slider"
            />
            <input
              className="bg-gray-200 w-16 ml-4 px-2 py-1 text-right font-semibold rounded-sm"
              type="number"
              value={quality}
              min="1"
              max="100"
              step="1"
              pattern="\d+"
              onChange={(e) => {
                const numValue = Number(e.target.value);
                if (numValue > 100) {
                  setQuality(100);
                } else if (numValue < 1) {
                  setQuality(1);
                } else {
                  setQuality(Math.round(numValue));
                }
              }}
            />
          </div>
        )}
        <div
          className="border-dashed border-2 border-gray-400 rounded-md py-12 flex flex-col justify-center items-center relative"
          onDrop={(e) => {
            e.preventDefault();
            overlayRef.current?.classList.replace("opacity-100", "opacity-0");
            const { files } = e.dataTransfer;
            filterFiles(files);
          }}
          onDragOver={(e) => {
            if (e.dataTransfer.types.indexOf("Files") > -1) e.preventDefault();
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            if (e.dataTransfer.types.indexOf("Files") > -1) {
              overlayRef.current?.classList.replace("opacity-0", "opacity-100");
            }
          }}
          onDragLeave={(e) => {
            if (e.dataTransfer.types.indexOf("Files") > -1) {
              overlayRef.current?.classList.replace("opacity-100", "opacity-0");
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
          <p className="mb-1 font-semibold text-gray-900 flex flex-wrap justify-center">
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
            onChange={(e) => {
              if (e.target.files) filterFiles(e.target.files);
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

        <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
          Uploaded Images
        </h1>

        <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
          {formData.getAll("images").length > 0 ? (
            formData.getAll("images").map((value, index) => (
              <li
                className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 h-24 sm:h-48 md:h-44 lg:h-36 xl:h-48"
                key={(value as File).name}
              >
                <div
                  tabIndex={0}
                  className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative text-transparent shadow-sm"
                >
                  <img
                    alt="upload preview"
                    src={URL.createObjectURL(value)}
                    className="w-full h-full sticky object-cover rounded-md bg-fixed"
                  />

                  <div className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3 hover:bg-gray-700 transition-colors hover:bg-opacity-70 hover:text-white duration-300">
                    <h1 className="flex-1">{(value as File).name}</h1>
                    <div className="flex">
                      <span className="p-1">
                        <i>
                          <svg
                            className="fill-current w-4 h-4 ml-auto"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm9 .5l-2.519 4-2.481-1.96-4 5.96h14l-5-8zm8-4v14h-20v-14h20zm2-2h-24v18h24v-18z" />
                          </svg>
                        </i>
                      </span>

                      <p className="p-1 size text-xs">
                        {((value as File).size / 1024 / 1024).toFixed(3)} MB
                      </p>
                      <button
                        type="button"
                        className="ml-auto focus:outline-none hover:bg-gray-900 p-1 rounded-md transition-colors duration-300"
                        onClick={() => {
                          deleteFile(index);
                        }}
                      >
                        <svg
                          className="pointer-events-none fill-current w-4 h-4 ml-auto"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            className="pointer-events-none"
                            d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li
              id="empty"
              className="h-full w-full text-center flex flex-col items-center justify-center "
            >
              <img
                className="mx-auto w-32"
                src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                alt="no data"
              />
              <span className="text-small text-gray-500">
                No files selected
              </span>
            </li>
          )}
        </ul>
        <div className="pt-8 flex justify-end">
          <button
            type="submit"
            className="mt-2 rounded-md px-3 py-1 bg-purple-500 text-white hover:bg-gray-300 hover:text-black focus:shadow-outline focus:outline-none transition-colors duration-300 font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
