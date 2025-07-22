import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QrScannerModal({
  onResult,
  onClose,
}: {
  onResult: (text: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false // 👈 tambahkan argumen verbose
    );

    scanner.render(
      (decodedText) => {
        scanner.clear().then(() => {
          onResult(decodedText);
        });
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded">
        <div id="qr-reader" />
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
