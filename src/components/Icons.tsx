import { h, JSX } from 'preact';

function Icon(props: JSX.SVGAttributes<SVGSVGElement>) {
  return <svg fill="currentColor" width="24" height="24" {...props} />;
}

export const DeleteIcon = (props: JSX.SVGAttributes<SVGSVGElement>) => {
  return (
    <Icon {...props}>
      <path
        className="pointer-events-none"
        d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
      />
    </Icon>
  );
};

export const DownloadIcon = (props: JSX.SVGAttributes<SVGSVGElement>) => {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </Icon>
  );
};

export const LoadingIcon = (props: JSX.SVGAttributes<SVGSVGElement>) => {
  return (
    <Icon {...props}>
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </Icon>
  );
};

export const UploadCloudIcon = (props: JSX.SVGAttributes<SVGSVGElement>) => {
  return (
    <Icon {...props}>
      <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
    </Icon>
  );
};

export const ImageIcon = (props: JSX.SVGAttributes<SVGSVGElement>) => {
  return (
    <Icon {...props}>
      <path d="M5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm9 .5l-2.519 4-2.481-1.96-4 5.96h14l-5-8zm8-4v14h-20v-14h20zm2-2h-24v18h24v-18z" />
    </Icon>
  );
};

export const QuestionIcon = (props: JSX.SVGAttributes<SVGSVGElement>) => {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        stroke="currentColor"
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </Icon>
  );
};
