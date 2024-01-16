"use client";

import Cover from "@/components/cover";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import Toolbar from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { TabsContent } from "@/components/ui/tabs";
import Canvas from "@/components/canvas";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { serializeAsJSON } from "@excalidraw/excalidraw";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });
  const update = useMutation(api.documents.update);

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  const onContentChange = (content: string) => {
    update({
      id: params.documentId,
      content,
    });
  };

  const onCanvasChange = (
    excalidrawElements: readonly ExcalidrawElement[],
    excalidrawAppState: AppState,
    excalidrawFiles: BinaryFiles
  ) => {
    const excalidrawContent = serializeAsJSON(
      excalidrawElements,
      excalidrawAppState,
      excalidrawFiles,
      "database"
    );

    update({
      id: params.documentId,
      excalidrawContent,
    });
  };

  return (
    <>
      <TabsContent value="editor">
        <div className="pb-8">
          <Cover url={document.coverImage} />
          <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
            <Toolbar initialData={document} />
            <Editor
              onChange={onContentChange}
              initialContent={document.content}
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="canvas" className="h-full">
        <Canvas
          onChange={onCanvasChange}
          initialData={
            document.excalidrawContent && JSON.parse(document.excalidrawContent)
          }
        />
      </TabsContent>
    </>
  );
};

export default DocumentIdPage;
