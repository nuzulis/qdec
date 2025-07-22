import { useMemo, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import type { CustomCellRendererProps } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface IRow {
  nama: string;
  countryOfOrigin: string;
  flightNumber: string;
  place: string;
  dateArrive: string;
  comodites: string;
  statusDeklarasi: string;
  rekomPetugas: string;
  kewarganegaraan: string;
  jenisKelamin: string;
  noPaspor: string;
  noPonsel: string;
  email: string;
  tanggalKedatangan: string;
  tanggalKeberangkatan: string;
  modaTransportasi: string;
  tempatKedatangan: string;
  jenisAlatAngkut: string;
  namaAlatAngkut: string;
  nomorVoyage: string;
  tujuanPerjalanan: string;
  jenisTempatTinggal: string;
  provinsi: string;
  kota: string;
  alamat: string;
  bentukKomoditas: string;
  jumlahKomoditas: number;
}

interface CustomAgGridRemoteTableProps {
  rowData: IRow[];
}

const CompanyLogoRenderer = (params: CustomCellRendererProps) => (
  <span className="flex items-center h-full w-full">
    <p className="truncate">{params.value}</p>
  </span>
);

const statusDeklarasiBadgeRenderer = (
  params: CustomCellRendererProps<IRow>
) => {
  const value = params.value;
  let colorClass = "bg-gray-200 text-gray-800";

  if (value === "Rilis") {
    colorClass = "bg-green-100 text-green-800";
  } else if (value === "Periksa Lanjut") {
    colorClass = "bg-yellow-100 text-yellow-800";
  } else if (value === "Quarantine Bin") {
    colorClass = "bg-red-100 text-red-800";
  }

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded ${colorClass}`}>
      {value}
    </span>
  );
};

function DetailModal({
  data,
  onClose,
}: {
  data: IRow | null;
  onClose: () => void;
}) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Detail Data</h2>
        <ul className="text-sm space-y-1 max-h-[70vh] overflow-y-auto">
          <li>
            <strong>Kewarganegaraan:</strong> {data.kewarganegaraan}
          </li>
          <li>
            <strong>Nama Lengkap:</strong> {data.nama}
          </li>
          <li>
            <strong>Jenis Kelamin:</strong> {data.jenisKelamin}
          </li>
          <li>
            <strong>Nomor Paspor:</strong> {data.noPaspor}
          </li>
          <li>
            <strong>Nomor Ponsel:</strong> {data.noPonsel}
          </li>
          <li>
            <strong>Email:</strong> {data.email}
          </li>
          <li>
            <strong>Tanggal Kedatangan:</strong> {data.tanggalKedatangan}
          </li>
          <li>
            <strong>Tanggal Keberangkatan:</strong> {data.tanggalKeberangkatan}
          </li>
          <li>
            <strong>Moda Transportasi:</strong> {data.modaTransportasi}
          </li>
          <li>
            <strong>Tempat Kedatangan:</strong> {data.tempatKedatangan}
          </li>
          <li>
            <strong>Jenis Alat Angkut:</strong> {data.jenisAlatAngkut}
          </li>
          <li>
            <strong>Nama Alat Angkut:</strong> {data.namaAlatAngkut}
          </li>
          <li>
            <strong>Nomor Voyage/Flight:</strong> {data.nomorVoyage}
          </li>
          <li>
            <strong>Tujuan Perjalanan:</strong> {data.tujuanPerjalanan}
          </li>
          <li>
            <strong>Jenis Tempat Tinggal:</strong> {data.jenisTempatTinggal}
          </li>
          <li>
            <strong>Provinsi:</strong> {data.provinsi}
          </li>
          <li>
            <strong>Kota:</strong> {data.kota}
          </li>
          <li>
            <strong>Alamat:</strong> {data.alamat}
          </li>
          <li>
            <strong>Jenis Komoditas:</strong> {data.comodites}
          </li>
          <li>
            <strong>Bentuk Komoditas:</strong> {data.bentukKomoditas}
          </li>
          <li>
            <strong>Jumlah Komoditas:</strong> {data.jumlahKomoditas}
          </li>
          <li>
            <strong>Status Deklarasi:</strong> {data.statusDeklarasi}
          </li>
          <li>
            <strong>Rekomendasi Petugas:</strong> {data.rekomPetugas}
          </li>
        </ul>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomAgGridRemoteTable({
  rowData,
}: CustomAgGridRemoteTableProps) {
  const [selectedRow, setSelectedRow] = useState<IRow | null>(null);

  const columnDefs = useMemo<ColDef<IRow>[]>(
    () => [
      { headerName: "Nama", field: "nama", cellRenderer: CompanyLogoRenderer },
      { headerName: "Negara Asal", field: "countryOfOrigin" },
      { headerName: "Penerbangan", field: "flightNumber" },
      { headerName: "Tempat", field: "place" },
      { headerName: "Tanggal", field: "dateArrive" },
      { headerName: "Komoditas", field: "comodites" },
      {
        headerName: "Status",
        field: "statusDeklarasi",
        cellRenderer: statusDeklarasiBadgeRenderer,
      },
      { headerName: "Rekomendasi", field: "rekomPetugas" },
      {
        headerName: "Detail",
        cellRenderer: (params: any) => (
          <button
            className="text-blue-600 underline text-sm"
            onClick={() => setSelectedRow(params.data)}
          >
            Lihat
          </button>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          pagination={true}
          paginationPageSize={10}
        />
      </div>

      <DetailModal data={selectedRow} onClose={() => setSelectedRow(null)} />
    </>
  );
}
