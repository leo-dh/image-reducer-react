import React, { HTMLProps, ReactNode } from "react";

interface SliderProps {
  value: number;
  callback: (arg: number) => void;
  info?: ReactNode;
}

Slider.defaultProps = {
  info: null,
};

export default function Slider({
  value,
  callback,
  info,
  className,
}: SliderProps & HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={`flex items-start flex-col sm:flex-row sm:items-center w-min ${className}`}
    >
      {info}
      <div className="flex items-center">
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={value}
          onChange={(e) => {
            callback(Number(e.target.value));
          }}
          className="slider w-40 sm:w-auto"
        />
        <input
          className="bg-gray-200 w-16 ml-4 px-2 py-1 text-right font-semibold rounded-sm"
          type="number"
          value={value}
          min="1"
          max="100"
          step="1"
          pattern="\d+"
          onChange={(e) => {
            const numValue = Number(e.target.value);
            if (numValue > 100) {
              callback(100);
            } else if (numValue < 1) {
              callback(1);
            } else {
              callback(Math.round(numValue));
            }
          }}
        />
      </div>
    </div>
  );
}
