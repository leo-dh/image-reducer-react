import { h, Fragment, JSX } from 'preact';
import { DeleteIcon, ImageIcon } from './Icons';

interface PreviewProps extends JSX.HTMLAttributes<HTMLUListElement> {
  files: File[];
  deleteCallback: (idx: number) => void;
}

export default function Preview({
  files,
  deleteCallback,
  className,
  ...props
}: PreviewProps) {
  return (
    <ul
      className={`flex flex-1 flex-wrap ${
        files.length > 0 ? 'bg-gray-100' : ''
      } rounded-md p-2 ${className}`}
      {...props}
    >
      {files.length > 0 ? (
        files.map((file, index) => (
          <Preview.Card
            key={file.name}
            filename={file.name}
            filesize={file.size}
            imgSrc={URL.createObjectURL(file)}
            index={index}
            ctaButton={idx => (
              <button
                type="button"
                className="ml-auto focus:outline-none hover:bg-gray-900 p-1 rounded-md transition-colors duration-300"
                onClick={() => {
                  deleteCallback(idx);
                }}
              >
                <DeleteIcon
                  className="pointer-events-none w-4 h-4 ml-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                />
              </button>
            )}
          />
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
          <span className="text-small text-gray-500">No files uploaded</span>
        </li>
      )}
    </ul>
  );
}

interface PreviewCardProps {
  imgSrc: string;
  filename: string;
  filesize: number;
  index: number;
  ctaButton: (
    index: number,
    imgSrc: string,
    filename: string,
    filesize: number,
  ) => JSX.Element;
}

Preview.Card = function Card({
  imgSrc,
  filename,
  filesize,
  ctaButton,
  index,
}: PreviewCardProps) {
  return (
    <li className="block p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 h-28 sm:h-48 md:h-44 lg:h-40 xl:h-50">
      <div className="w-full h-full rounded-lg focus:outline-none focus:shadow-outline bg-gray-100 relative shadow-sm">
        <img
          alt="upload preview"
          src={imgSrc}
          className="w-full h-full sticky object-cover rounded-lg bg-fixed shadow-lg"
        />

        <div className="flex flex-col rounded-lg text-xs w-full h-full z-20 absolute top-0 p-2 bg-gray-700 bg-opacity-70 text-white justify-between">
          <h1 className="font-semibold clamp-2 overflow-ellipsis break-words">
            {filename}
          </h1>
          <div className="flex items-center">
            <span className="p-1 hidden sm:block">
              <i>
                <ImageIcon
                  className="w-4 h-4 ml-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                />
              </i>
            </span>

            <p className="p-1">
              {filesize / 1024 / 1024 > 1 ? (
                <>
                  <span>{`${(filesize / 1024 / 1024).toPrecision(4)}`}</span>
                  <span className="ml-0.5">MB</span>
                </>
              ) : (
                <>
                  <span>{`${(filesize / 1024).toPrecision(4)}`}</span>
                  <span className="ml-0.5">KB</span>
                </>
              )}
            </p>
            {ctaButton(index, imgSrc, filename, filesize)}
          </div>
        </div>
      </div>
    </li>
  );
};
