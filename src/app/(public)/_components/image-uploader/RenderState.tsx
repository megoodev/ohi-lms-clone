import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  CloudUploadIcon,
  ImageIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";


const RenderEmpetyState = ({ isDragActive }: { isDragActive: boolean }) => {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-8 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your files here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          Click to Upload
        </span>
      </p>
    </div>
  );
};

export default RenderEmpetyState;

export const RenderErrorState = () => {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className={cn("size-8 text-destructive")} />
      </div>
      <p className="text-base font-semibold">Upload Failed</p>
      <p className="text-xs mt-1 text-muted-foreground">Something went wrong</p>
      <Button variant="ghost" className="mt-2 p-0">
        Try Again
      </Button>
    </div>
  );
};

export const RenderUploadingState = ({ progress }: { progress: number }) => {
  return (
    <div className="text-center">
      <div className="flex items-center flex-col mx-auto justify-center gap-2.5 mb-4">
        <Spinner />
        <p className="text-2xl text-muted-foreground ">{progress}%</p>
      </div>
    </div>
  );
};

export const RenderUploadedState = ({
  url,
  isDeleting,
  onDelete,
  isImage
}: {
  url: string;
  isDeleting: boolean;
  onDelete: () => void;
  isImage: boolean;
}) => {
  return (
    <div className="text-center relative">
      <Button
        onClick={onDelete}
        type="button"
        disabled={isDeleting}
        variant={"ghost"}
        className="absolute top-4 lg:top-20 sm:top-2  right-4 hover:text-destructive hover:bg-destructive/10"
      >
        <XIcon className="size-4" />
      </Button>
      <div className="relative flex items-center mx-auto justify-center max-h-[100%] max-w-[100%] size-60 object-contain">
        {isImage ? (<Image src={url} alt={url} fill className="object-contain" />): ( <video src={url} controls className="w-full h-full object-contain"/>)}
        
      </div>
    </div>
  );
};
