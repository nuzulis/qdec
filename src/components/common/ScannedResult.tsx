import { useState } from "react";
import AccordionItem from "../ui/accordion/AccordionItem";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";

interface ScannedResultProps {
  data: any;
  createdAt: string;
  respon: string;
  responText: string
}

export default function ScannedResult({
  data,
  createdAt,
  respon,
  responText
}: ScannedResultProps) {
  const { tdHeader, karantina, id_permohonan } = data;
  const [openIndex, setOpenIndex] = useState<string | null>("karantina");
  let [lanjutan, setLanjutan] = useState<any>({
    rekom: "",
    keterangan: "",
  });

  const toggle = (index: string) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  function getNipFromJson(): string | undefined {
    const json = localStorage.getItem("user")
    if (!json) {
    return "";
  }
  try {
    const obj = JSON.parse(json);
    return obj.nip;
  } catch (e) {
    console.error("Invalid JSON:", e);
    return undefined;
  }
}

  const updateDeklarasi = async () => {
    try {
      const datakirim = {
        id_permohonan: id_permohonan,
        rekom: lanjutan.rekom,
        keterangan: lanjutan.keterangan,
        petugas: getNipFromJson()
      }
      const res = await fetch(
        `https://api3.karantinaindonesia.go.id/qdec/sendQDec/petugas`,
        {
          method: "POST",
          headers: {
            "Authorization": "Basic bXJpZHdhbjpaPnV5JCx+NjR7KF42WDQm",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datakirim)
        }
      );
      const json = await res.json();
      console.log("json respon", json)
      alert(json?.message ?? "Berhasil simpan rekomendasi")
    } catch (err) {
      alert("Gagal mengambil data.");
    }
  };

  return (
    <div className="mt-2">
      <div className=" mx-auto p-2 space-y-4">
        <div className="flex mb-0 place-content-between">
          <h3 className="text-xl mb-0">No. <b>{id_permohonan}</b></h3>
          <h3 className={"text-xl mb-0 font-bold" + (respon == "10" ? " text-red-600" : (respon == "11" ? " text-amber-700" : (respon == "12" ? " text-green-700" : "")))}>{responText}</h3>
        </div>
        <p>{createdAt}</p>
        <AccordionItem
          title={"Identitas Penumpang"}
          content={
            <table className="w-full text-sm text-left rtl:text-right text-black dark:text-gray-400">
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">Nama</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.nama}</td>
              </tr>
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">Paspor</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.paspor}</td>
              </tr>
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">Tanggal Lahir</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.tanggallahir}</td>
              </tr>
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">Negara Asal</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.kodenegara}</td>
              </tr>
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">Lokasi Kedatangan</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.lokasikedatangan}</td>
              </tr>
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">Nomor Telepon</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.no_ponsel}</td>
              </tr>
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">Alamat Tujuan</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.alamat_tujuan}</td>
              </tr>
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">Jenis Kelamin</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.jeniskelamin}</td>
              </tr>
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">Nomor Penerbangan</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.nomorpengangkut}</td>
              </tr>
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">Waktu Keberangkatan</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.tanggalkeberangkatan}</td>
              </tr>
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">Waktu Kedatangan</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.tanggalkedatangan}</td>
              </tr>
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">Tujuan Kedatangan</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.tujuan_kedatangan}</td>
              </tr>
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">Jenis Tempat</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.jenis_tempat_tinggal}</td>
              </tr>
              <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                <td className="text-black whitespace-nowrap dark:text-white">IMEI Terdaftar</td>
                <td className="text-black whitespace-nowrap dark:text-white">:</td>
                <td className="font-bold">{tdHeader.registrasiIMEI === "Y" ? "Ya" : "Tidak"}</td>
              </tr>
            </table>
            // <ul className="text-sm text-gray-800">
            //   <li>Nama: {tdHeader.nama}</li>
            //   <li>Paspor: {tdHeader.paspor}</li>
            //   <li>Tanggal Lahir: {tdHeader.tanggallahir}</li>
            //   <li>Negara Asal: {tdHeader.kodenegara}</li>
            //   <li>Lokasi Kedatangan: {tdHeader.lokasikedatangan}</li>
            //   <li>Nomor Telepon: {tdHeader.no_ponsel}</li>
            //   <li>Alamat Tujuan: {tdHeader.alamat_tujuan}</li>
            //   <li>Jenis Kelamin: {tdHeader.jeniskelamin}</li>
            //   <li>Nomor Penerbangan: {tdHeader.nomorpengangkut}</li>
            //   <li>Waktu Keberangkatan: {tdHeader.tanggalkeberangkatan}</li>
            //   <li>Waktu Kedatangan: {tdHeader.tanggalkedatangan}</li>
            //   <li>Tujuan Kedatangan: {tdHeader.tujuan_kedatangan}</li>
            //   <li>Jenis Tempat Tinggal: {tdHeader.jenis_tempat_tinggal}</li>
            //   <li>
            //     IMEI Terdaftar: {tdHeader.registrasiIMEI === "Y" ? "Ya" : "Tidak"}
            //   </li>
            // </ul>
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
                  <td className="text-black whitespace-nowrap dark:text-white">Jenis</td>
                  <td className="text-black whitespace-nowrap dark:text-white">:</td>
                  <td className="font-bold">{karantina.jenis_komoditas}</td>
                </tr>
                <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                  <td className="text-black whitespace-nowrap dark:text-white">Bentuk</td>
                  <td className="text-black whitespace-nowrap dark:text-white">:</td>
                  <td className="font-bold">{karantina.bentuk?.keterangan}</td>
                </tr>
                <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                  <td className="text-black whitespace-nowrap dark:text-white">Jumlah</td>
                  <td className="text-black whitespace-nowrap dark:text-white">:</td>
                  <td className="font-bold">{karantina.jumlah?.keterangan}</td>
                </tr>
                <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                  <td colSpan={3} className="text-black whitespace-nowrap dark:text-white">Negara Asal Komoditas : <b>{karantina.negara_komoditi}</b></td>
                </tr>
                <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                  <td colSpan={3} className="text-black whitespace-nowrap dark:text-white">Sertifikat Karantina : <b>{karantina.sertifikat_karantina}</b></td>
                </tr>
                <tr className="border-b dark:bg-black dark:border-gray-700 border-gray-200">
                  <td colSpan={3} className="text-black whitespace-nowrap dark:text-white">Komoditas : <b>{karantina.komoditi?.map((x: { keterangan: any; }) => x.keterangan).join(";")}</b></td>
                </tr>
              </tbody>
            </table>
          }
          isOpen={openIndex === "karantina"}
          onClick={() => toggle("karantina")}
        />
          <div className="border-2 p-2 rounded-xl">
            <center>
            <h2 className="text-2xl content-center">Rekomendasi Petugas</h2>

            </center>
            <hr />
            <div className="mb-2">
              <Label className="mb-0">Pilih Rekomendasi</Label>
              <Select
              defaultValue={lanjutan.rekom}
                options={[{ value: "12", label: "Rilis" }, { value: "11", label: "Periksa Lanjutan" }, { value: "10", label: "Tolak/Quarantine Bin" }, { value: "13", label: "Ajukan ke PTK" }]}
                placeholder="Pilih rekomendasi akhir"
                onChange={(e) => setLanjutan((x: any) => ({ ...x, rekom: e}))}
                className="dark:bg-dark-900"
              />
            </div>
            <div className="mb-2">
              <Label className="mb-0">Keterangan</Label>
              <TextArea value={lanjutan.keterangan} onChange={(e) => setLanjutan((x: any) => ({ ...x, keterangan: e}))} rows={2} className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" placeholder="Jelaskan tindakan karantina yang dilakukan atau yang lainnya" />
            </div>
            <Button onClick={updateDeklarasi} size="sm" className="w-full" variant="primary" >
  Submit
</Button>
          </div>
      </div>
    </div>
  );
}
