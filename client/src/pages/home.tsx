import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Download, QrCode } from "lucide-react";
import type { File } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<File> => {
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await apiRequest("POST", "/api/files", {
        filename: file.name,
        mimeType: file.type,
        size: file.size.toString(),
        data: fileData,
      });

      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      setLocation(`/success/${data.code}`);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Please try again with a smaller file",
      });
    },
  });

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Share Files Section */}
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold text-[#2D3748] mb-4">
              Share files securely
            </h1>
            <p className="text-[#2D3748] mb-8">
              Upload your files and share them with a 4-digit code or QR code.
            </p>

            <FileUploader
              onFileSelect={(file) => uploadMutation.mutate(file)}
              isUploading={uploadMutation.isPending}
            />
          </CardContent>
        </Card>

        {/* Receive Files Section */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-[#2D3748] mb-4">
              Receive files
            </h2>
            <p className="text-[#2D3748] mb-8">
              Enter a 4-digit code or scan a QR code to download shared files.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setLocation("/download")}
                className="h-24 bg-[#4A154B] hover:bg-[#3D1240]"
              >
                <div className="flex flex-col items-center gap-2">
                  <Download className="h-8 w-8" />
                  <span>Enter 4-digit code</span>
                </div>
              </Button>

              <Button
                onClick={() => setLocation("/scan")}
                className="h-24 bg-[#36B37E] hover:bg-[#2D995E]"
              >
                <div className="flex flex-col items-center gap-2">
                  <QrCode className="h-8 w-8" />
                  <span>Scan QR code</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}