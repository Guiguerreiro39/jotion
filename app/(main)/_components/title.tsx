"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDebounce } from "react-use";

interface TitleProps {
  initialData: Doc<"documents">;
}

const Title = ({ initialData }: TitleProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const update = useMutation(api.documents.update);

  const { control, reset, watch } = useForm({
    defaultValues: {
      title: initialData?.title || "Untitled",
    },
  });
  const title = watch("title");

  useDebounce(
    () => {
      update({
        id: initialData._id,
        title: title || "Untitled",
      });
    },
    400,
    [title]
  );

  const enableInput = () => {
    reset({
      title: initialData?.title,
    });
    setIsEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  useEffect(() => {
    reset({
      title: initialData?.title || "Untitled",
    });
  }, [initialData, reset]);

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              {...field}
              ref={inputRef}
              onBlur={disableInput}
              onKeyDown={onKeyDown}
              className="h-7 px-2 focus-visible:ring-transparent"
            />
          )}
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{title}</span>
        </Button>
      )}
    </div>
  );
};

const TitleSkeleton = () => {
  return <Skeleton className="h-6 w-20 rounded-md" />;
};

Title.Skeleton = TitleSkeleton;

export default Title;
