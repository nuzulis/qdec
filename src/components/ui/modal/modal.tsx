import { useState } from "react";
import AccordionItem from "../accordion/AccordionItem";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export default function DetailModal({
  isOpen,
  onClose,
  data,
}: DetailModalProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Parse payload JSON safely
  let parsedPayload: any = null;
  try {
    parsedPayload = data?.payload ? JSON.parse(data.payload) : null;
  } catch (error) {
    console.error("Invalid JSON in payload:", error);
  }

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative z-10 bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">Detail Data</h2>

        <AccordionItem
          title="Identitas Penumpang"
          isOpen={openIndex === 0}
          onClick={() => handleToggle(0)}
          content={
            <div>
              <p>
                <strong>Nama:</strong> {data?.nama_penumpang}
              </p>
              <p>
                <strong>Paspor:</strong> {data?.id_pass}
              </p>
              <p>
                <strong>Negara Asal:</strong> {data?.neg_asal}
              </p>
              <p>
                <strong>Lokasi Kedatangan:</strong> {data?.nama_pelabuhan}
              </p>
              <p>
                <strong>Nomor Penerbangan:</strong> {data?.nama_no_angkut}
              </p>
              <p>
                <strong>Waktu Keberangkatan:</strong> {data?.tgl_berangkat}
              </p>
              <p>
                <strong>Waktu Kedatangan:</strong> {data?.tgl_tiba}
              </p>
            </div>
          }
        />

        <AccordionItem
          title="Komoditas Karantina"
          isOpen={openIndex === 1}
          onClick={() => handleToggle(1)}
          content={
            <div>
              <p>
                <strong>Jenis:</strong> {data?.jns_karantina}
              </p>
              <p>
                <strong>Bentuk:</strong> {data?.bentuk_mp_id}
              </p>
              {parsedPayload?.karantina?.jumlah?.keterangan && (
                <p>
                  <strong>Jumlah:</strong>{" "}
                  {parsedPayload.karantina.jumlah.keterangan}
                </p>
              )}
            </div>
          }
        />

        <AccordionItem
          title="Hasil Pemeriksaan"
          isOpen={openIndex === 2}
          onClick={() => handleToggle(2)}
          content={
            <div>
              <p>
                <strong>Rekomendasi Petugas:</strong>{" "}
                <span
                  className={
                    "text-sm px-3 py-1 rounded-full font-semibold shadow inline-block " +
                    (data?.rekom_petugas === "10"
                      ? "bg-red-100 text-red-700"
                      : data?.rekom_petugas === "11"
                      ? "bg-yellow-100 text-yellow-800"
                      : data?.rekom_petugas === "12"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700")
                  }
                >
                  {data?.rekom_petugas_text || "-"}
                </span>
              </p>

              <p>
                <strong>Respon:</strong>{" "}
                <span
                  className={
                    "text-sm px-3 py-1 rounded-full font-semibold shadow inline-block " +
                    (data?.respon === "10"
                      ? "bg-red-100 text-red-700"
                      : data?.respon === "11"
                      ? "bg-yellow-100 text-yellow-800"
                      : data?.respon === "12"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700")
                  }
                >
                  {data?.respon_text || "-"}
                </span>
              </p>

              <p>
                <strong>Jenis MP:</strong> {data?.jns_karantina} -{" "}
                {data?.bentuk_mp_id}
              </p>
            </div>
          }
        />

        <div className="mt-6 text-right">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
