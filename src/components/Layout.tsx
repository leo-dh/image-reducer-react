import { h, Fragment, ComponentChildren } from 'preact';
export default function Layout({ children }: { children: ComponentChildren }) {
  return (
    <>
      <nav className="bg-purple-500 w-full">
        <div className="mx-auto container px-4 sm:px-8 py-2 xl:max-w-screen-xl">
          <h2 className="text-white font-extrabold text-2xl pointer-events-none select-none">
            Minify Images
          </h2>
        </div>
      </nav>
      <div className="mx-auto container p-4 sm:p-8 xl:max-w-screen-xl">
        {children}
      </div>
    </>
  );
}
