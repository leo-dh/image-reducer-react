import React, { HTMLProps } from "react";

interface PreviewProps {
  files: File[];
  deleteCallback: (idx: number) => void;
}

export default function Preview({
  files,
  deleteCallback,
  className,
}: PreviewProps & HTMLProps<HTMLUListElement>) {
  return (
    <ul
      id="gallery"
      className={`flex flex-1 flex-wrap -m-1 ${
        files.length > 0 ? "bg-gray-100" : ""
      } rounded-md p-2 ${className}`}
    >
      {files.length > 0 ? (
        files.map((file, index) => (
          <li
            className="block p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 h-24 sm:h-48 md:h-44 lg:h-36 xl:h-48"
            key={file.name}
          >
            <div
              tabIndex={0}
              className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative text-transparent shadow-sm"
            >
              <img
                alt="upload preview"
                src={URL.createObjectURL(file)}
                className="w-full h-full sticky object-cover rounded-md bg-fixed shadow-lg"
              />

              <div className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3 hover:bg-gray-700 transition-colors hover:bg-opacity-70 hover:text-white duration-300">
                <h1 className="flex-1">{file.name}</h1>
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
                    {(file.size / 1024 / 1024).toFixed(3)} MB
                  </p>
                  <button
                    type="button"
                    className="ml-auto focus:outline-none hover:bg-gray-900 p-1 rounded-md transition-colors duration-300"
                    onClick={() => {
                      deleteCallback(index);
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
          <span className="text-small text-gray-500">No files selected</span>
        </li>
      )}
    </ul>
  );
}
