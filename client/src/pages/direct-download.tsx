import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { File } from "@shared/schema";

export default function DirectDownload() {
  const { code } = useParams();
  const { toast } = useToast();

  const { data: file, isLoading } = useQuery<File>({
    queryKey: [`/api/files/${code}`],
    enabled: !!code,
  });

  const downloadFile = () => {
    if (!file) return;

    try {
      const [, base64Data] = file.data.split(",");
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: file.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Your file should begin downloading shortly",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error downloading your file",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <p className="text-center text-[#2D3748]">Loading file details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold text-[#2D3748] mb-4">
              File not found
            </h1>
            <p className="text-[#2D3748]">
              This file may have expired or the code is incorrect.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-[#2D3748] mb-4">
            Ready to download
          </h1>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#2D3748]">Filename:</p>
              <p className="font-medium">{file.filename}</p>
            </div>

            <div>
              <p className="text-sm text-[#2D3748]">Size:</p>
              <p className="font-medium">{file.size} bytes</p>
            </div>

            <Button
              onClick={downloadFile}
              className="w-full bg-[#36B37E] hover:bg-[#2D995E]"
            >
              <Download className="mr-2 h-4 w-4" />
              Download File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}