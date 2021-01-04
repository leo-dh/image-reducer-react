// TODO Finish card ui
import React from "react";

interface ResultCardProps {
  url: string;
  initialSize: string;
  finalSize: string;
  filename: string;
}
export default function ResultCard({
  url,
  filename,
  finalSize,
  initialSize,
}: ResultCardProps) {
  return (
    <div className="p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6">
      <article className="overflow-hidden rounded-lg shadow-lg">
        <img
          alt="Placeholder"
          className="block h-36 w-full object-cover"
          src={url}
        />

        <header className="flex items-center justify-between leading-tight p-2 md:p-4">
          <p>
            <span className="font-semibold mr-0.5">
              {(Number(initialSize) / 1024).toFixed(2)}
            </span>
            <span className="text-xs">KB</span>
          </p>
          <p>
            <span className="font-semibold mr-0.5">
              {(Number(finalSize) / 1024).toFixed(2)}
            </span>
            <span className="text-xs">KB</span>
          </p>
        </header>

        <footer className="flex items-center justify-between leading-none p-2 md:p-4">
          <button
            type="button"
            className="border-2 border-purple-500 text-purple-500 px-3 py-1 rounded-md font-semibold text-sm hover:bg-purple-500 hover:text-white transition-colors duration-300"
          >
            <a href={url} download={filename}>
              Download
            </a>
          </button>
        </footer>
      </article>
    </div>
  );
}
