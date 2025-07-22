import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { FaQrcode } from "react-icons/fa";
import { DeklarasiResult } from "../../pages/Tables/ScanDeklarasi";

interface QRCodeScannerProps {
  onClose: () => void;
  onScan: (data: DeklarasiResult) => void;
}

export default function QRCodeScanner({ onClose, onScan }: QRCodeScannerProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const scannerInstance = useRef<Html5Qrcode | null>(null);
  const [isRunning, setIsRunning] = useState(false); // status scanner

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [manualId, setManualId] = useState<string>("");

  useEffect(() => {
    const initScanner = async () => {
      if (!qrRef.current) return;

      if (scannerInstance.current && isRunning) {
        try {
          await scannerInstance.current.stop();
          await scannerInstance.current.clear();
          setIsRunning(false);
        } catch (e) {
          console.warn("Gagal menghentikan scanner lama", e);
        }
      }

      const scanner = new Html5Qrcode("qr-reader", { verbose: false });
      scannerInstance.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            try {
              await scanner.stop();
              await scanner.clear();
              setIsRunning(false);
              handleFetchById(decodedText.trim());
            } catch (e) {
              setErrorMsg("Gagal menghentikan scanner.");
            }
          },
          (error) => {
            if (!error.toString().includes("NotFoundException")) {
              setErrorMsg("Gagal membaca QR Code.");
            }
          }
        );
        setIsRunning(true);
      } catch (err) {
        setErrorMsg("Tidak bisa mengakses kamera.");
      }
    };

    initScanner();

    return () => {
      const stopScanner = async () => {
        if (scannerInstance.current && isRunning) {
          try {
            await scannerInstance.current.stop();
            await scannerInstance.current.clear();
            setIsRunning(false);
          } catch (e) {
            console.warn("Gagal menghentikan scanner saat unmount", e);
          }
        }
      };
      stopScanner();
    };
  }, []);

  const handleFetchById = async (id: string) => {
    setErrorMsg("");
    try {
      const res = await fetch(
        `https://api3.karantinaindonesia.go.id/qdec/findQDec?id=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: "Basic bXJpZHdhbjpaPnV5JCx+NjR7KF42WDQm", // Ganti sesuai kebutuhan
            "Content-Type": "application/json",
          },
        }
      );

      const json = await res.json();

      if (!json?.data?.payload) {
        throw new Error("Data tidak ditemukan.");
      }

      const result: DeklarasiResult = {
        id_permohonan: id,
        payload: JSON.parse(json.data.payload),
        created_at: json.data.created_at || "",
        respon: json.data.respon || "",
      };

      onScan(result);
    } catch (e: any) {
      setErrorMsg(e.message || "Gagal mengambil data.");
    }
  };

  const handleManualSubmit = () => {
    if (!manualId.trim()) return;
    handleFetchById(manualId.trim());
  };

  const handleClose = async () => {
    if (scannerInstance.current && isRunning) {
      try {
        await scannerInstance.current.stop();
        await scannerInstance.current.clear();
        setIsRunning(false);
      } catch (e) {
        console.warn("Error saat menutup scanner", e);
      }
    }
    onClose();
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mt-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FaQrcode />
          QR Code Scanner
        </div>
        <button
          onClick={handleClose}
          className="text-red-500 text-xs hover:underline"
        >
          Tutup
        </button>
      </div>

      <div
        ref={qrRef}
        id="qr-reader"
        className="w-full h-64 rounded-md overflow-hidden"
      />

      {errorMsg && (
        <p className="text-sm text-red-500 mt-2 text-center">{errorMsg}</p>
      )}

      <div className="mt-4 text-sm text-center">
        <p className="text-gray-600">
          Atau masukkan ID Permohonan secara manual:
        </p>
        <div className="flex flex-col items-center gap-2 mt-2">
          <input
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            placeholder="Contoh: 2507150000008"
            className="border px-2 py-1 rounded w-64 text-sm"
          />
          <button
            onClick={handleManualSubmit}
            className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700"
          >
            Gunakan ID Manual
          </button>
        </div>
      </div>
    </div>
  );
}
