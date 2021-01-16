import { h, JSX, ComponentChildren } from 'preact';

interface SliderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  value: number;
  callback: (arg: number) => void;
  info?: ComponentChildren;
}

export default function Slider({
  value,
  callback,
  info,
  className,
  ...props
}: SliderProps) {
  return (
    <div
      className={`flex items-start flex-col sm:flex-row sm:items-center w-min ${className}`}
      {...props}
    >
      {info}
      <div className="flex items-center">
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={value}
          onChange={e => {
            callback(Number((e.target as HTMLInputElement).value));
          }}
          className="slider w-40 sm:w-auto"
        />
        <div className="relative ml-4">
          <input
            className="bg-gray-200 w-16 px-2 py-1 text-right font-semibold rounded-sm outline-none"
            type="number"
            value={value}
            min="1"
            max="100"
            step="1"
            pattern="\d+"
            onChange={e => {
              callback(Number((e.target as HTMLInputElement).value));
            }}
            onBlur={e => {
              let quality = ~~Number((e.target as HTMLInputElement).value);
              if (quality > 100) {
                quality = 100;
              } else if (quality < 1) {
                quality = 1;
              }
              callback(quality);
            }}
          />
          <svg
            className="absolute h-4 -left-4 top-1/2 -mt-2 fill-current text-gray-200 transform rotate-90"
            x="0px"
            y="0px"
            viewBox="0 0 255 255"
          >
            <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
          </svg>
        </div>
      </div>
    </div>
  );
}

Slider.defaultProps = {
  info: null,
};
