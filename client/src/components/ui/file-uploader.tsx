import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export function FileUploader({ onFileSelect, isUploading }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8
        transition-colors duration-200 ease-in-out
        ${isDragActive ? "border-[#4A154B] bg-[#4A154B]/5" : "border-gray-300"}
        ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center text-center">
        <Upload className="h-12 w-12 text-[#4A154B] mb-4" />
        
        <p className="text-lg font-medium text-[#2D3748] mb-2">
          {isDragActive ? "Drop the file here" : "Drag & drop your file here"}
        </p>
        
        <p className="text-sm text-[#2D3748]">
          or click to select a file
        </p>

        {isUploading && (
          <div className="w-full mt-6">
            <Progress value={33} className="h-2" />
            <p className="text-sm text-[#2D3748] mt-2">Uploading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
