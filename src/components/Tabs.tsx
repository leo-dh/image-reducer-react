import React, { ReactNode, HTMLProps } from "react";

interface TabsProps<T> {
  values: Array<T>;
  activeValue: T;
  callback: (arg: T) => void;
  info?: ReactNode;
}

Tabs.defaultProps = {
  info: null,
};

export default function Tabs<T>({
  values,
  activeValue,
  callback,
  className,
  info,
}: TabsProps<T> & HTMLProps<HTMLDivElement>) {
  return (
    <div className={`flex items-center w-min ${className}`}>
      {info}
      <ul className="flex cursor-pointer border-gray-200 border-2 w-min ">
        {values.map((value) => (
          <li
            key={value as any}
            className={`py-2 px-6 text-sm font-semibold ${
              activeValue === value
                ? "bg-white shadow-inner"
                : "text-gray-500 bg-gray-200"
            }`}
            onClick={() => callback(value)}
          >
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
}
