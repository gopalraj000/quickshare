import { useState, useEffect } from "react";
import QRCode from "qrcode";

export function useQRCode(text: string) {
  const [qrCode, setQRCode] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: {
        dark: "#4A154B",
        light: "#FFFFFF",
      },
    }).then(setQRCode);
  }, [text]);

  return qrCode;
}
