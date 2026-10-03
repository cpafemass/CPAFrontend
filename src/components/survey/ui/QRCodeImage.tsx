import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeImageProps {
  value: string;
}

export function QRCodeImage({ value }: QRCodeImageProps) {
  const [generated, setGenerated] = useState({
    value: "",
    qrCodeUrl: "",
    error: "",
  });
  const isImageDataUrl = value.startsWith("data:image/");
  const qrCodeUrl = isImageDataUrl
    ? value
    : generated.value === value
      ? generated.qrCodeUrl
      : "";
  const error =
    !isImageDataUrl && generated.value === value ? generated.error : "";

  useEffect(() => {
    let isMounted = true;
    if (isImageDataUrl) return () => {
      isMounted = false;
    };

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
        if (isMounted) {
          setGenerated({ value, qrCodeUrl: nextQrCodeUrl, error: "" });
        }
      })
      .catch(() => {
        if (isMounted) {
          setGenerated({
            value,
            qrCodeUrl: "",
            error: "Não foi possível gerar a imagem do QR Code.",
          });
        }
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
