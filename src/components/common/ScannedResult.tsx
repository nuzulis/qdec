interface ScannedResultProps {
  data: any;
  createdAt: string;
  respon: string;
}

export default function ScannedResult({
  data,
  createdAt,
  respon,
}: ScannedResultProps) {
  const { tdHeader, karantina, id_permohonan } = data;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Identitas Penumpang</h3>
      <ul className="text-sm text-gray-800">
        <li>
          No.: {id_permohonan} | Dibuat tgl: {createdAt}
        </li>
        <li>Respon Sistem: {respon}</li>
        <li>Nama: {tdHeader.nama}</li>
        <li>Paspor: {tdHeader.paspor}</li>
        <li>Tanggal Lahir: {tdHeader.tanggallahir}</li>
        <li>Negara Asal: {tdHeader.kodenegara}</li>
        <li>Lokasi Kedatangan: {tdHeader.lokasikedatangan}</li>
        <li>Nomor Telepon: {tdHeader.no_ponsel}</li>
        <li>Alamat Tujuan: {tdHeader.alamat_tujuan}</li>
        <li>Jenis Kelamin: {tdHeader.jeniskelamin}</li>
        <li>Nomor Penerbangan: {tdHeader.nomorpengangkut}</li>
        <li>Waktu Keberangkatan: {tdHeader.tanggalkeberangkatan}</li>
        <li>Waktu Kedatangan: {tdHeader.tanggalkedatangan}</li>
        <li>Tujuan Kedatangan: {tdHeader.tujuan_kedatangan}</li>
        <li>Jenis Tempat Tinggal: {tdHeader.jenis_tempat_tinggal}</li>
        <li>
          IMEI Terdaftar: {tdHeader.registrasiIMEI === "Y" ? "Ya" : "Tidak"}
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">Komoditas Karantina</h3>
      <ul className="text-sm text-gray-800">
        <li>Jenis: {karantina.jenis_komoditas}</li>
        <li>Bentuk: {karantina.bentuk?.keterangan}</li>
        <li>Jumlah: {karantina.jumlah?.keterangan}</li>
        <li>Negara Asal Komoditas: {karantina.negara_komoditi}</li>
        <li>Sertifikat Karantina: {karantina.sertifikat_karantina}</li>
        <li>Komoditas:</li>
        <ul className="ml-4 list-disc">
          {karantina.komoditi?.map((k: any, idx: number) => (
            <li key={idx}>{k.keterangan}</li>
          ))}
        </ul>
      </ul>
    </div>
  );
}
