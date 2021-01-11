import { h, ComponentChildren } from 'preact';
export default function Layout({ children }: { children: ComponentChildren }) {
  return <div className="mx-auto container">{children}</div>;
}
