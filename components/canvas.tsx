import { getSceneVersion } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useDebounce } from "react-use";
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  }
);

type ICanvasProps = {
  onChange: (
    excalidrawElements: readonly ExcalidrawElement[],
    excalidrawAppState: AppState,
    excalidrawFiles: BinaryFiles
  ) => void;
  initialData?: any;
};

type IExcalidrawData = {
  elements: readonly ExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
};

const Canvas = ({ onChange, initialData }: ICanvasProps) => {
  const [excalidrawData, setExcalidrawData] = useState<IExcalidrawData>();
  const [version, setVersion] = useState<number>();

  useDebounce(
    () => {
      if (excalidrawData) {
        onChange(
          excalidrawData.elements,
          excalidrawData.appState,
          excalidrawData.files
        );
      }
    },
    1000,
    [excalidrawData]
  );

  return (
    <div className="w-full h-full pt-12">
      <Excalidraw
        initialData={{
          elements: initialData.elements,
          appState: initialData.appState,
          files: initialData.files,
        }}
        onChange={(elements, appState, files) => {
          const currentVersion = getSceneVersion(elements);

          if (version !== currentVersion) {
            setExcalidrawData({ elements, appState, files });
            setVersion(currentVersion);
            return;
          }
        }}
      />
    </div>
  );
};

export default Canvas;
