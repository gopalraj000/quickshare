import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useToast } from "@/hooks/use-toast";

export default function Scan() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  const onScanSuccess = (decodedText: string) => {
    try {
      const url = new URL(decodedText);
      const code = url.pathname.split('/').pop();
      if (code) {
        setLocation(`/d/${code}`);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid QR code",
          description: "This QR code is not for a valid file",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid QR code",
        description: "This QR code is not in the correct format",
      });
    }
  };

  const onScanError = (error: any) => {
    console.error('QR scan error:', error);
    toast({
      variant: "destructive",
      title: "Scanner error",
      description: "Please make sure your camera is enabled",
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-[#2D3748] mb-4">
            Scan QR Code
          </h1>
          <p className="text-[#2D3748] mb-8">
            Position the QR code in front of your camera
          </p>

          <div className="overflow-hidden rounded-lg">
            <div id="qr-reader" className="w-full" />
          </div>

          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="w-full mt-4"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}