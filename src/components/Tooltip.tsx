import { h, JSX } from 'preact';
import { QuestionIcon } from './Icons';

export default function Tooltip({
  className,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`relative mr-1 group ${className}`} {...props}>
      <QuestionIcon
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="h-5 w-5 cursor-pointer"
      />
      <div className="absolute bottom-full -right-full mb-1 -mr-12 transform scale-0 group-hover:scale-100 transition-all opacity-0 group-hover:opacity-100 origin-bottom">
        <div className="relative">
          <div className="bg-gray-200 text-gray-800 text-xs rounded py-2 px-3 right-0 bottom-full w-40">
            <p>
              Choosing <code className="text-purple-500">`Browser`</code>{' '}
              (recommended) will compress the images on the spot instead of
              sending the images to a server.
            </p>
          </div>
          <svg
            className="absolute h-2 w-full left-0 top-full fill-current text-gray-200"
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
