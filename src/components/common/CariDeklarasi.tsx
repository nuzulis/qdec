import { useState } from "react";
import QRCodeScanner from "./QRCodeScanner";
import { DeklarasiResult } from "../../pages/Tables/ScanDeklarasi";

interface CariDeklarasiProps {
  onSubmit: (data: DeklarasiResult) => void;
}

export default function CariDeklarasi({ onSubmit }: CariDeklarasiProps) {
  const [inputId, setInputId] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const fetchManual = async () => {
    try {
      const res = await fetch(
        `https://api3.karantinaindonesia.go.id/qdec/findQDec?id=${inputId}`,
        {
          method: "GET",
          headers: {
            Authorization: "Basic bXJpZHdhbjpaPnV5JCx+NjR7KF42WDQm",
            "Content-Type": "application/json",
          },
        }
      );
      const json = await res.json();
      const parsed: DeklarasiResult = {
        id_permohonan: inputId,
        payload: JSON.parse(json.data?.payload || "{}"),
        created_at: json.data?.created_at || "",
        respon: json.data?.respon || "",
      };
      onSubmit(parsed);
    } catch (err) {
      alert("Gagal mengambil data.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputId.trim()) {
      fetchManual();
    }
  };

  const handleScanSuccess = (data: DeklarasiResult) => {
    setInputId(data.id_permohonan);
    onSubmit(data);
    setShowScanner(false);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Masukkan ID Permohonan
        </label>
        <input
          type="text"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
          placeholder="Contoh: 2507150000008"
        />
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
          >
            Cari
          </button>
          <button
            type="button"
            onClick={() => setShowScanner(!showScanner)}
            className="text-blue-600 text-sm underline"
          >
            {showScanner ? "Tutup Scan QR" : "Scan QR"}
          </button>
        </div>
      </form>

      {showScanner && (
        <QRCodeScanner
          onScan={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
