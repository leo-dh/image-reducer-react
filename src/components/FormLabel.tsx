import { h, JSX } from 'preact';
export default function FormLabel({
  className,
  ...props
}: JSX.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-extrabold mr-4 w-24 ${className}`} {...props} />;
}
