import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeImageProps {
  value: string;
}

export function QRCodeImage({ value }: QRCodeImageProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [error, setError] = useState("");
  const isImageDataUrl = value.startsWith("data:image/");

  useEffect(() => {
    let isMounted = true;
    setQrCodeUrl("");
    setError("");

    if (isImageDataUrl) {
      setQrCodeUrl(value);
      return () => {
        isMounted = false;
      };
    }

    QRCode.toDataURL(value, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 280,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((nextQrCodeUrl) => {
        if (isMounted) setQrCodeUrl(nextQrCodeUrl);
      })
      .catch(() => {
        if (isMounted) setError("Não foi possível gerar a imagem do QR Code.");
      });

    return () => {
      isMounted = false;
    };
  }, [isImageDataUrl, value]);

  if (error) {
    return (
      <div className="grid aspect-square w-full max-w-72 place-items-center rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm font-bold text-red-700">
        {error}
      </div>
    );
  }

  if (!qrCodeUrl) {
    return (
      <div className="grid aspect-square w-full max-w-72 place-items-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-500">
        Gerando QR Code...
      </div>
    );
  }

  return (
    <img
      className="w-full max-w-72 rounded-lg border border-slate-200 bg-white p-3"
      src={qrCodeUrl}
      alt="QR Code de confirmação da participação"
    />
  );
}
