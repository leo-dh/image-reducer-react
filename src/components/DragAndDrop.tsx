import { h, JSX, RefObject, ComponentChildren } from 'preact';
import { useReducer, useRef } from 'preact/compat';
import { UploadCloudIcon } from './Icons';

enum ReducerActionType {
  SET_IN_DROP_ZONE,
  SET_FILES,
}

interface ReducerState {
  inDropZone: boolean;
}

interface ReducerAction extends Partial<ReducerState> {
  type: ReducerActionType;
  files?: File[];
  setFilesCallback?: (files: File[]) => void;
}

const initialState: ReducerState = {
  inDropZone: false,
};

const reducer = (state: ReducerState, action: ReducerAction): ReducerState => {
  switch (action.type) {
    case ReducerActionType.SET_IN_DROP_ZONE:
      return {
        inDropZone: action.inDropZone || initialState.inDropZone,
      };
    case ReducerActionType.SET_FILES:
      if (action.setFilesCallback && action.files) {
        action.setFilesCallback(action.files);
      }
      return {
        inDropZone: false,
      };
    default:
      return state;
  }
};

interface DragAndDropProps extends JSX.HTMLAttributes<HTMLDivElement> {
  setFilesCallback?: (files: File[]) => void;
  children: (inputRef: RefObject<HTMLInputElement>) => ComponentChildren;
}

export default function DragAndDrop({
  className,
  children,
  setFilesCallback,
  ...props
}: DragAndDropProps) {
  const overlayRef = useRef<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>();
  const [state, dispatch] = useReducer<ReducerState, ReducerAction>(reducer, {
    inDropZone: false,
  });
  const { inDropZone } = state;

  return (
    <div
      className={`relative ${className}`}
      {...props}
      onDragEnter={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragLeave={e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
          type: ReducerActionType.SET_IN_DROP_ZONE,
          inDropZone: e.currentTarget.contains(e.relatedTarget as HTMLElement),
        });
      }}
      onDragOver={e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
          type: ReducerActionType.SET_IN_DROP_ZONE,
          inDropZone: true,
        });
      }}
      onDrop={e => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.dataTransfer?.files) return;
        const files = Array.from(e.dataTransfer.files);
        dispatch({
          type: ReducerActionType.SET_FILES,
          files,
          setFilesCallback,
        });
        e.dataTransfer.clearData();
      }}
    >
      <div
        id="overlay"
        className={`w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex-col items-center justify-center rounded-md flex bg-white bg-opacity-90 transition-opacity duration-300 ${
          inDropZone ? 'opacity-100' : 'opacity-0'
        }`}
        ref={overlayRef}
      >
        <UploadCloudIcon
          className="w-12 h-12 mb-3 text-purple-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        />
        <p className="text-lg text-purple-500">Drop files to upload</p>
      </div>
      <input
        type="file"
        multiple
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        ref={inputRef}
        onInput={e => {
          const files = (e.target as HTMLInputElement).files;
          if (files && setFilesCallback) setFilesCallback(Array.from(files));
        }}
      />
      {children(inputRef)}
    </div>
  );
}
