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

  const [openIndex, setOpenIndex] = useState<string | null>("karantina");
  const [lanjutan, setLanjutan] = useState<any>({
    rekom: "",
    keterangan: "",
  });
  const [qrData, setQrData] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const toggle = (index: string) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  function getNipFromJson(): string | undefined {
    const json = sessionStorage.getItem("user");
    if (!json) return "";
    try {
      const obj = JSON.parse(json);
      return obj.nip;
    } catch (e) {
      console.error("Invalid JSON:", e);
      return undefined;
    }
  }

  useEffect(() => {
    if (respon === "12") setLanjutan((x: any) => ({ ...x, rekom: "12" }));
    else if (respon === "10") setLanjutan((x: any) => ({ ...x, rekom: "10" }));
  }, [respon]);

  const updateDeklarasi = async () => {
    if (!lanjutan.rekom) {
      alert("Silakan pilih rekomendasi terlebih dahulu!");
      return;
    }

    try {
      const datakirim = {
        id_permohonan: id_permohonan,
        rekom: lanjutan.rekom,
        keterangan: lanjutan.keterangan,
        petugas: getNipFromJson(),
      };

      const res = await fetch(
        `https://api3.karantinaindonesia.go.id/qdec/sendQDec/petugas`,
        {
          method: "POST",
          headers: {
            Authorization: "Basic bXJpZHdhbjpaPnV5JCx+NjR7KF42WDQm",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datakirim),
        }
      );

      const json = await res.json();
      alert(json?.message ?? "Berhasil simpan rekomendasi");

      const encodedId = btoa(datakirim.id_permohonan);
      const qrUrl = `https://passq.karantinaindonesia.go.id/detail.php?id=${encodedId}`;
      setQrData(qrUrl);
      setShowModal(true);
    } catch (err) {
      alert("Gagal mengambil data.");
    }
  };

  return (
    <div className="mt-2">
      <div className="mx-auto p-2 space-y-4">
        {/* Header */}
        <div className="flex mb-0 justify-between items-center">
          <h3 className="text-xl mb-0">
            No. <b>{id_permohonan}</b>
          </h3>
          <span
            className={
              "text-sm px-3 py-1 rounded-full font-bold shadow " +
              (respon === "10"
                ? "bg-red-500 text-gray-100"
                : respon === "11"
                ? "bg-yellow-500 text-gray-100"
                : respon === "12"
                ? "bg-green-700 text-gray-100"
                : "bg-gray-500 text-gray-100")
            }
          >
            {responText}
          </span>
        </div>

        <p>{createdAt}</p>

        {/* Accordion */}
        <AccordionItem
          title={"Identitas Penumpang"}
          content={
            <table className="w-full text-sm text-left rtl:text-right text-black dark:text-gray-400">
              <tbody>
                <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                  <td className="text-black whitespace-nowrap dark:text-white">
                    Nama
                  </td>
                  <td className="text-black whitespace-nowrap dark:text-white">
                    :
                  </td>
                  <td className="font-bold">{tdHeader.nama}</td>
                </tr>
              </tbody>
            </table>
          }
          isOpen={openIndex === "penumpang"}
          onClick={() => toggle("penumpang")}
        />

        <AccordionItem
          title={"Komoditas Karantina"}
          content={
            <table className="w-full text-left rtl:text-right text-black dark:text-gray-400">
              <tbody>
                <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                  <td className="text-black whitespace-nowrap dark:text-white">
                    Jenis
                  </td>
                  <td className="text-black whitespace-nowrap dark:text-white">
                    :
                  </td>
                  <td className="font-bold">{karantina.jenis_komoditas}</td>
                </tr>
              </tbody>
            </table>
          }
          isOpen={openIndex === "karantina"}
          onClick={() => toggle("karantina")}
        />

        {/* Rekomendasi */}
        <div className="border-2 p-4 rounded-xl">
          <center>
            <h2 className="text-2xl font-semibold mb-2">Rekomendasi Petugas</h2>
          </center>
          <hr className="mb-4" />

          {rekom_petugas_text ? (
            <div className="flex justify-center mt-4">
              <span
                className={`inline-block px-6 py-3 text-xl font-bold rounded-full ${
                  rekom_petugas_text === "PERIKSA"
                    ? "bg-yellow-400 text-yellow-900"
                    : rekom_petugas_text === "RILIS"
                    ? "bg-green-400 text-green-900"
                    : rekom_petugas_text === "TOLAK/Q-BIN"
                    ? "bg-red-400 text-red-900"
                    : "bg-gray-300 text-gray-900"
                }`}
              >
                {rekom_petugas_text}
              </span>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <Label className="mb-0">Pilih Rekomendasi</Label>
                {respon === "12" ? (
                  <Select
                    defaultValue="12"
                    options={[{ value: "12", label: "Rilis" }]}
                    disabled
                    onChange={() => {}}
                  />
                ) : respon === "10" ? (
                  <Select
                    defaultValue="10"
                    options={[{ value: "10", label: "Tolak/Quarantine Bin" }]}
                    disabled
                    onChange={() => {}}
                  />
                ) : (
                  <Select
                    defaultValue={lanjutan.rekom}
                    options={[
                      { value: "12", label: "Rilis" },
                      { value: "10", label: "Tolak/Quarantine Bin" },
                    ]}
                    placeholder="Pilih rekomendasi akhir"
                    onChange={(e) =>
                      setLanjutan((x: any) => ({ ...x, rekom: e }))
                    }
                  />
                )}
              </div>

              <div className="mb-4">
                <Label className="mb-0">Keterangan</Label>
                <TextArea
                  value={lanjutan.keterangan}
                  onChange={(e) =>
                    setLanjutan((x: any) => ({ ...x, keterangan: e }))
                  }
                  rows={2}
                  placeholder="Jelaskan tindakan karantina yang dilakukan atau yang lainnya"
                  className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              <Button
                onClick={updateDeklarasi}
                size="sm"
                className="w-full"
                variant="primary"
              >
                Submit
              </Button>
            </>
          )}
        </div>

        {showModal && qrData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[280px] relative">
              {/* Tombol Close */}
              <button
                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300"
                onClick={() => {
                  setShowModal(false);
                  if (onClose) onClose();
                }}
              >
                ✕
              </button>
              <div className="relative w-[200px] h-[200px] mx-auto">
                <QRCodeCanvas
                  id="qrCodeCanvas"
                  value={qrData}
                  size={200}
                  level="H"
                />
                <img
                  src="./images/logo/logo-qr.png"
                  alt="Karantina"
                  className="absolute top-1/2 left-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
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
                Download QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
