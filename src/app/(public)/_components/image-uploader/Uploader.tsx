"use client";
import { FileRejection, useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import RenderEmpetyState, {
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";
import { toast } from "sonner";

interface UploaderState {
  file: File | null;
  error: boolean;
  id: string | null;
  progress: number;
  key?: string;
  isDeleting: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
  uploading: boolean;
}
interface iAppProps {
  onChange: (key: string) => void;
  value: string;
  typeAccept: "image" | "video";
}
const Uploader = ({ onChange, value, typeAccept }: iAppProps) => {
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    fileType: typeAccept === "video" ? "video" : "image",
    id: null,
    isDeleting: false,
    progress: 0,
    uploading: false,
    key: value,
  });

  const uploadFile = useCallback(async (file: File) => {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      const response = await fetch("/api/s3/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!response.ok) {
        toast.error("something went wrong");

        setFileState((prev) => ({
          ...prev,
          uploading: false,
          error: true,
          progress: 0,
        }));
      }
      const { presignedUrl, key } = await response.json();
      setFileState((prev) => ({
        ...prev,
        key: key,
        uploading: false,
        progress: 0,
        error: false,
      }));

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const precentageCompleted = (event.loaded / event.total) * 100;
            setFileState((prev) => ({
              ...prev,
              progress: Math.round(precentageCompleted),
            }));
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              progress: 100,
            }));
            onChange?.(key);

            toast.success("File uploaded successfully");
            resolve();
          } else {
            reject(new Error("Uploading failed..."));
            return;
          }
        };

        xhr.onerror = () => {
          reject(new Error("Uploading failed..."));
        };
        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch {
      toast.error("somthing went wrong");
      setFileState((prev) => ({
        ...prev,
        progress: 0,
        error: true,
        uploading: false,
      }));
    }
  }, [onChange]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setFileState({
        error: false,
        file: file,
        objectUrl: URL.createObjectURL(file),
        id: crypto.randomUUID(),
        progress: 0,
        uploading: false,
        isDeleting: false,
        fileType: typeAccept === "video" ? "video" : "image",
      });
      uploadFile(file);
    },
    [typeAccept, uploadFile]
  );

  const rejrctedFile = useCallback((fileRejection: FileRejection[]) => {
    if (fileRejection.length > 0) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );
      const fileSizeToBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      if (fileSizeToBig) {
        toast.error("file size is big, max size is 5mb");
      }

      if (tooManyFiles) {
        toast.error("Too many files selected, max is one 1");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: typeAccept === "video" ? { "video/*": [] } : { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: typeAccept === "video" ? (5000 * 1024 * 1024) : (5 * 1024 * 1024),
    onDropRejected: rejrctedFile,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  const handleRemoveFile = async () => {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({ ...prev, isDeleting: true }));
      const reponse = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });
      if (!reponse.ok) {
        toast.error("Failed to remove file from storage");
        setFileState((prev) => ({ ...prev, isDeleting: false }));
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
        setFileState(() => ({
          error: false,
          uploading: false,
          progress: 0,
          file: null,
          id: null,
          isDeleting: false,
          fileType: typeAccept === "video" ? "video" : "image",
        }));
        toast.success("File reomved successfully");
      }
    } catch {
      toast.error("Error removing file. Please try again");
      setFileState((prev) => ({ ...prev, isDeleting: false }));
    }
  };
  const renderState = () => {
    if (fileState.uploading) {
      return <RenderUploadingState progress={fileState.progress} />;
    }
    if (fileState.error) {
      return <RenderErrorState />;
    }
    if (fileState.file) {
      return (
        <RenderUploadedState
          isImage={fileState.fileType === "image"}
          url={fileState.objectUrl as string}
          isDeleting={fileState.isDeleting}
          onDelete={handleRemoveFile}
        />
      );
    }
    return <RenderEmpetyState isDragActive={isDragActive} />;
  };
  return (
    <Card
      {...getRootProps()}
      className={cn(
        "realtive flex cursor-pointer justify-center border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent>
        <input {...getInputProps()} />
        {renderState()}
      </CardContent>
    </Card>
  );
};

export default Uploader;
