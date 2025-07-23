import { FaTimes } from "react-icons/fa";
import { MdOutlineInfo } from "react-icons/md";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export default function DetailModal({ isOpen, onClose, data }: ModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-blue bg-opacity-10 backdrop-blur-sm overflow-y-auto pt-24 pb-10 px-4">
      <div className="bg-blue-50 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto p-6 relative animate-fade-in space-y-4">
        {/* Tombol close di pojok kanan atas */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Judul */}
        <div className="flex items-center gap-2 text-blue-900">
          <MdOutlineInfo className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Detail Data Deklarasi</h2>
        </div>

        {/* Isi detail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {/* DetailCard... */}
          <DetailCard label="Respon" value={data.respon_text} />
          <DetailCard label="Rekomendasi Petugas" value={data.rekom_petugas} />
          <DetailCard label="Tanggal Rekomendasi" value={data.date_rekom} />
          <DetailCard label="Nama Penumpang" value={data.nama_penumpang} />
          <DetailCard label="Negara Asal" value={data.neg_asal} />
          <DetailCard label="Port Asal" value={data.port_asal} />
          <DetailCard label="Negara Tujuan" value={data.neg_tuju} />
          <DetailCard label="Port Tujuan" value={data.port_tuju} />
          <DetailCard label="Moda Transportasi" value={data.moda} />
          <DetailCard label="Nama/No Angkut" value={data.nama_no_angkut} />
          <DetailCard label="Tanggal Berangkat" value={data.tgl_berangkat} />
          <DetailCard label="Tanggal Tiba" value={data.tgl_tiba} />
          <DetailCard label="Jenis Kegiatan" value={data.jns_kegiatan} />
          <DetailCard label="Jenis Karantina" value={data.jns_karantina} />
          <DetailCard label="Bentuk Media Pembawa" value={data.bentuk_mp_id} />
          <DetailCard label="Tanggal Pengajuan" value={data.tgl_aju} />
          <DetailCard label="Keterangan" value={data.keterangan} />
          <DetailCard label="Petugas Input" value={data.petugas_input} />
        </div>

        {/* Tombol Close di bawah modal */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
function DetailCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="bg-white border border-blue-200 rounded-xl p-3 shadow-sm">
      <p className="text-gray-500 font-medium">{label}</p>
      <p className="text-blue-900 font-semibold mt-1 text-sm break-words">
        {value || <span className="italic text-gray-400">-</span>}
      </p>
    </div>
  );
}
