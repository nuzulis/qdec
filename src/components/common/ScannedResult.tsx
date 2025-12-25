import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import AccordionItem from "../ui/accordion/AccordionItem";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";

interface ScannedResultProps {
  data: any;
  createdAt: string;
  respon: string;
  responText: string;
  onClose?: () => void;
}

export default function ScannedResult({
  data,
  createdAt,
  respon,
  responText,
  onClose,
}: ScannedResultProps) {
  const { tdHeader, karantina, id_permohonan, rekom_petugas_text } = data;

  const [openIndex, setOpenIndex] = useState<string | null>("penumpang");
  const [lanjutan, setLanjutan] = useState({
    rekom: "",
    keterangan: "",
  });
  const [qrData, setQrData] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const toggle = (key: string) => {
    setOpenIndex((prev) => (prev === key ? null : key));
  };

  const getRekomClass = (text: string) => {
    switch (text) {
      case "PERIKSA":
        return "bg-yellow-400 text-yellow-900";
      case "RILIS":
        return "bg-green-400 text-green-900";
      case "TOLAK/Q-BIN":
        return "bg-red-400 text-red-900";
      default:
        return "bg-gray-300 text-gray-900";
    }
  };

  const getNipFromJson = (): string | undefined => {
    const json = sessionStorage.getItem("user");
    if (!json) return undefined;
    try {
      return JSON.parse(json).nip;
    } catch {
      return undefined;
    }
  };

  useEffect(() => {
    if (["10", "11", "12"].includes(respon)) {
      setLanjutan((x) => ({ ...x, rekom: respon }));
    }
  }, [respon]);

  const updateDeklarasi = async () => {
    console.log("REKOMENDASI:", lanjutan.rekom);

    if (!lanjutan.rekom) {
      alert("Silakan pilih rekomendasi terlebih dahulu!");
      return;
    }

    const payload = {
      id_permohonan,
      rekom: lanjutan.rekom,
      keterangan: lanjutan.keterangan,
      petugas: getNipFromJson(),
    };

    try {
      const res = await fetch(
        "https://api3.karantinaindonesia.go.id/qdec/sendQDec/petugas",
        {
          method: "POST",
          headers: {
            Authorization: "Basic bXJpZHdhbjpaPnV5JCx+NjR7KF42WDQm",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      alert(json?.message ?? "Berhasil simpan rekomendasi");

      const encodedId = btoa(id_permohonan);
      setQrData(
        `https://passq.karantinaindonesia.go.id/detail.php?id=${encodedId}`
      );
      setShowModal(true);
    } catch {
      alert("Gagal mengambil data.");
    }
  };

  return (
    <div className="mt-2">
      <div className="p-2 space-y-4">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl">
            No. <b>{id_permohonan}</b>
          </h3>
          <span
            className={`text-sm px-3 py-1 rounded-full font-bold ${
              respon === "10"
                ? "bg-red-500 text-white"
                : respon === "11"
                ? "bg-yellow-500 text-white"
                : respon === "12"
                ? "bg-green-700 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {responText}
          </span>
        </div>
        <p>{createdAt}</p>
        {/* IDENTITAS */}
        <AccordionItem
          title="Identitas Penumpang"
          isOpen={openIndex === "penumpang"}
          onClick={() => toggle("penumpang")}
          content={
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td>Nama</td>
                  <td>:</td>
                  <td className="font-bold">{tdHeader.nama}</td>
                </tr>
                <tr>
                  <td>No. Paspor</td>
                  <td>:</td>
                  <td className="font-bold">{tdHeader.paspor}</td>
                </tr>
                <tr>
                  <td>Negara</td>
                  <td>:</td>
                  <td className="font-bold">{tdHeader.kodenegara}</td>
                </tr>
                <tr>
                  <td>Lokasi Kedatangan</td>
                  <td>:</td>
                  <td className="font-bold">{tdHeader.lokasikedatangan}</td>
                </tr>
                <tr>
                  <td>No. Penerbangan</td>
                  <td>:</td>
                  <td className="font-bold">{tdHeader.nomorpengangkut}</td>
                </tr>
                <tr>
                  <td>Keberangkatan</td>
                  <td>:</td>
                  <td className="font-bold">{tdHeader.tanggalkeberangkatan}</td>
                </tr>
                <tr>
                  <td>Kedatangan</td>
                  <td>:</td>
                  <td className="font-bold">{tdHeader.tanggalkedatangan}</td>
                </tr>
              </tbody>
            </table>
          }
        />
        {/* KOMODITAS */}
        <AccordionItem
          title="Komoditas Karantina"
          isOpen={openIndex === "karantina"}
          onClick={() => toggle("karantina")}
          content={
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td>Jenis</td>
                  <td>:</td>
                  <td>{karantina.jenis_komoditas}</td>
                </tr>
                <tr>
                  <td>Komoditas</td>
                  <td>:</td>
                  <td>
                    {karantina.komoditi
                      .map((k: any) => k.keterangan)
                      .join(", ")}
                  </td>
                </tr>
                <tr>
                  <td>Bentuk</td>
                  <td>:</td>
                  <td>{karantina.bentuk.keterangan}</td>
                </tr>
                <tr>
                  <td>Jumlah</td>
                  <td>:</td>
                  <td>{karantina.jumlah.keterangan}</td>
                </tr>
                <tr>
                  <td>Negara</td>
                  <td>:</td>
                  <td>{karantina.negara_komoditi}</td>
                </tr>
                <tr>
                  <td>Sertifikat</td>
                  <td>:</td>
                  <td>{karantina.sertifikat_karantina}</td>
                </tr>
              </tbody>
            </table>
          }
        />
        {/* REKOMENDASI */}
        <div className="border-2 p-4 rounded-xl">
          <h2 className="text-center text-xl font-semibold mb-3">
            Rekomendasi Petugas
          </h2>

          {rekom_petugas_text ? (
            <div className="flex justify-center">
              <span
                className={`px-6 py-3 rounded-full font-bold ${getRekomClass(
                  rekom_petugas_text
                )}`}
              >
                {rekom_petugas_text}
              </span>
            </div>
          ) : (
            <>
              <Label>Pilih Rekomendasi</Label>
              <Select
                options={[
                  { value: "11", label: "PERIKSA" },
                  { value: "12", label: "RILIS" },
                  { value: "10", label: "TOLAK/Q-BIN" },
                ]}
                onChange={(val: any) => {
                  const value = typeof val === "string" ? val : val?.value;
                  setLanjutan((x) => ({ ...x, rekom: value }));
                }}
              />

              <Label className="mt-3">Keterangan</Label>
              <TextArea
                value={lanjutan.keterangan}
                onChange={(val: string) =>
                  setLanjutan((x) => ({ ...x, keterangan: val }))
                }
              />

              <Button
                onClick={updateDeklarasi}
                disabled={!lanjutan.rekom}
                className="w-full mt-4"
              >
                Submit
              </Button>
            </>
          )}
        </div>
        {/* QR Code Modal */}{" "}
        {showModal && qrData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            {" "}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[280px] relative">
              {" "}
              {/* Tombol Close */}{" "}
              <button
                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300"
                onClick={() => {
                  setShowModal(false);
                  if (onClose) onClose();
                }}
              >
                {" "}
                ✕{" "}
              </button>{" "}
              <div className="relative w-[200px] h-[200px] mx-auto">
                {" "}
                <QRCodeCanvas
                  id="qrCodeCanvas"
                  value={qrData}
                  size={200}
                  level="H"
                />{" "}
                <img
                  src="./images/logo/logo-qr.png"
                  alt="Karantina"
                  className="absolute top-1/2 left-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2"
                />{" "}
              </div>{" "}
              <button
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  const qrCanvas = document.getElementById(
                    "qrCodeCanvas"
                  ) as HTMLCanvasElement;
                  const logoImg = new Image();
                  logoImg.src = "./images/logo/logo-qr.png";
                  logoImg.onload = () => {
                    const canvas = document.createElement("canvas");
                    const size = qrCanvas.width;
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                      ctx.drawImage(qrCanvas, 0, 0);
                      const logoSize = size * 0.2;
                      const x = (size - logoSize) / 2;
                      const y = (size - logoSize) / 2;
                      ctx.drawImage(logoImg, x, y, logoSize, logoSize);
                      const url = canvas.toDataURL("image/png");
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "qr-code.png";
                      link.click();
                    }
                  };
                }}
              >
                {" "}
                Download QR{" "}
              </button>{" "}
            </div>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}
