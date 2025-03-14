import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useQRCode } from "@/lib/hooks";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { File } from "@shared/schema";

export default function Success() {
  const { code } = useParams();
  const { toast } = useToast();
  const qrCode = useQRCode(`${window.location.origin}/d/${code}`);

  const { data: file } = useQuery<File>({
    queryKey: [`/api/files/${code}`],
    enabled: !!code,
  });

  const copyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast({
        title: "Code copied!",
        description: "Share this code with others to let them download your file",
      });
    }
  };

  if (!file) return null;

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-[#2D3748] mb-4">
            File uploaded successfully!
          </h1>

          <div className="bg-white p-4 rounded-lg border mb-6">
            <p className="text-sm text-[#2D3748] mb-2">File code:</p>
            <div className="flex items-center gap-2">
              <code className="text-3xl font-mono">{code}</code>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyCode}
                className="text-[#3182CE]"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center mb-6">
            <p className="text-sm text-[#2D3748] mb-4">Or scan this QR code:</p>
            <img
              src={qrCode}
              alt="QR Code"
              className="w-48 h-48"
            />
          </div>

          <p className="text-sm text-[#2D3748] text-center">
            Your file will be available for 24 hours
          </p>
        </CardContent>
      </Card>
    </div>
  );
}