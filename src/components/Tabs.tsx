import React, { HTMLAttributes, ReactNode } from "react"

interface TabsProps<T> extends HTMLAttributes<HTMLDivElement> {
  values: Array<T>
  activeValue: T
  callback: (arg: T) => void
  info?: ReactNode
}

export default function Tabs<T>({
  values,
  activeValue,
  callback,
  info,
  className,
  ...props
}: TabsProps<T>) {
  return (
    <div
      className={`flex items-start sm:items-center flex-col sm:flex-row w-min space-y-2 sm:space-y-0 ${className}`}
      {...props}
    >
      {info}
      <ul className="flex cursor-pointer border-gray-200 border-2 w-min divide-x-2 divide-gray-100">
        {values.map(value => (
          <li
            key={value as any}
            className={`py-2 px-6 text-sm font-bold ${
              activeValue === value
                ? "bg-white shadow-inner"
                : "text-gray-500 bg-gray-200"
            }`}
            onClick={() => callback(value)}
          >
            <>{value}</>
          </li>
        ))}
      </ul>
    </div>
  )
}

Tabs.defaultProps = {
  info: null,
}
