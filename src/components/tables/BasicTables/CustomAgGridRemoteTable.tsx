import { useState, useMemo, JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import DetailModal from "../../ui/modal/modal";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import useDarkMode from "../../../hooks/useDarkMode";

type RowType = {
  id: string;
  id_qr: string;
  nama_penumpang: string;
  id_pass: string;
  neg_asal: string;
  port_tuju: string;
  nama_no_angkut: string;
  tgl_tiba: string;
  jns_karantina: any;
  bentuk_mp_id: any;
  respon_text: string;
  rekom_petugas_text: any;
};

export default function CustomRDTCRemoteTable({
  rowData,
}: {
  rowData: RowType[];
}) {
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState<RowType | null>(null);
  const isDark = useDarkMode();

  const handleDetailClick = (id: string) => {
    const found = rowData.find((item) => item.id === id);
    if (found) {
      setSelectedData(found);
      setShowModal(true);
    }
  };

  const filteredData = useMemo(() => {
    return rowData.filter((item) => {
      const values = Object.values(item).join(" ").toLowerCase();
      return values.includes(filterText.toLowerCase());
    });
  }, [rowData, filterText]);

  const columns: TableColumn<RowType>[] = [
    {
      name: "Nomor QR",
      selector: (row: { id_qr: any; }) => row.id_qr,
      sortable: true,
      wrap: true,
      maxWidth: "200px",
    },
    {
      name: "Nama Penumpang",
      cell: (row: { nama_penumpang: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; id_pass: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
        <div className="leading-tight">
          <div className="font-semibold text-sm">{row.nama_penumpang}</div>
          <div className="text-xs text-gray-600">Paspor: {row.id_pass}</div>
        </div>
      ),
      sortable: true,
      wrap: true,
      maxWidth: "200px",
    },
    {
      name: "Negara Asal",
      selector: (row: { neg_asal: any; }) => row.neg_asal,
      sortable: true,
      wrap: true,
      maxWidth: "200px",
    },
    {
      name: "Port Tujuan",
      selector: (row: { port_tuju: any; }) => row.port_tuju,
      sortable: true,
      wrap: true,
      maxWidth: "200px",
    },
    {
      name: "Nomor Voyage",
      selector: (row: { nama_no_angkut: any; }) => row.nama_no_angkut,
      sortable: true,
      wrap: true,
      maxWidth: "200px",
    },
    {
      name: "Tanggal Tiba",
      selector: (row: { tgl_tiba: any; }) => row.tgl_tiba,
      sortable: true,
      wrap: true,
      maxWidth: "200px",
    },
    {
      name: "MP",
      selector: (row: { jns_karantina: any; bentuk_mp_id: any; }) =>
        `${row.jns_karantina || ""} - ${row.bentuk_mp_id || ""}`,
      cell: (row: { jns_karantina: any; bentuk_mp_id: any; }) => (
        <span className="text-sm">
          {`${row.jns_karantina || ""} - ${row.bentuk_mp_id || ""}`}
        </span>
      ),
      sortable: true,
      wrap: true,
      maxWidth: "200px",
    },
    {
      name: "Respon",
      selector: (row: { respon_text: string; }) => row.respon_text?.toUpperCase() || "-",
      cell: (row: { respon_text: string; }) => {
        const val = row.respon_text?.toUpperCase() || "-";
        const getColorClass = () => {
          switch (val) {
            case "PERIKSA":
              return "bg-yellow-200 text-yellow-800";
            case "RILIS":
              return "bg-green-200 text-green-800";
            case "TOLAK/Q-BIN":
              return "bg-red-200 text-red-800";
            default:
              return "bg-gray-200 text-gray-800";
          }
        };
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${getColorClass()}`}
          >
            {val}
          </span>
        );
      },
      sortable: true,
      wrap: true,
      maxWidth: "200px",
    },
    {
      name: "Rekom Petugas",
      selector: (row: { rekom_petugas_text: string }) => row.rekom_petugas_text || "-",
      sortable: true,
      wrap: true,
      maxWidth: "200px",
    },
    {
      name: "Detail",
      cell: (row: { id: string; }) => (
        <button
          className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
          onClick={() => handleDetailClick(row.id)}
        >
          Lihat
        </button>
      ),
      ignoreRowClick: true,
      button: true,
    },
  ];
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: isDark ? "#1f2937" : "oklch(88.2% 0.059 254.128)",
        color: isDark ? "#f9fafb" : "#1f2937",
        fontWeight: "bold",
        fontSize: "14px",
        textTransform: "uppercase" as const,
        whiteSpace: "normal" as const,
        wordBreak: "break-word" as const,
        overflowWrap: "break-word" as const,
        lineHeight: "1.2",
        maxWidth: "250px",
      },
    },
    rows: {
      style: {
        backgroundColor: isDark ? "#111827" : "white",
        color: isDark ? "#f9fafb" : "#1f2937",
      },
    },
    pagination: {
      style: {
        backgroundColor: isDark ? "#1f2937" : "white",
        color: isDark ? "#f9fafb" : "#1f2937",
      },
    },
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Deklarasi");
    worksheet.columns = [
      { header: "Nomor QR", key: "id_qr", width: 20 },
      { header: "Nama Penumpang", key: "nama_penumpang", width: 125 },
      { header: "Negara Asal", key: "neg_asal", width: 20 },
      { header: "Port Tujuan", key: "port_tuju", width: 20 },
      { header: "Nomor Voyage", key: "nama_no_angkut", width: 25 },
      { header: "Tanggal Tiba", key: "tgl_tiba", width: 15 },
      { header: "MP", key: "mp", width: 30 },
      { header: "Respon", key: "respon_text", width: 15 },
      { header: "Rekom Petugas", key: "rekom_petugas_text", width: 20 },
    ];
    worksheet.getRow(1).font = { bold: true };

    filteredData.forEach((item) => {
      worksheet.addRow({
        id_qr: item.id_qr,
        nama_penumpang: item.nama_penumpang,
        id_pass: item.id_pass,
        neg_asal: item.neg_asal,
        port_tuju: item.port_tuju,
        nama_no_angkut: item.nama_no_angkut,
        tgl_tiba: item.tgl_tiba,
        mp: `${item.jns_karantina || ""} - ${item.bentuk_mp_id || ""}`,
        respon_text: item.respon_text?.toUpperCase() || "-",
        rekom_petugas_text: item.rekom_petugas_text || "-",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Data-Deklarasi-${new Date().toISOString()}.xlsx`);
  };

  return (
    <>
      <div className="mb-4 w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Cari data..."
          className="border px-3 py-2 rounded w-full md:w-1/2 lg:w-1/3 text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
        >
          Excel
        </button>
      </div>

      <div className="w-full overflow-x-auto max-w-full px-2">
        <DataTable
          columns={columns}
          data={filteredData}
          customStyles={customStyles}
          pagination
          highlightOnHover
        />
      </div>

      {showModal && selectedData && (
        <DetailModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          data={selectedData}
        />
      )}
    </>
  );
}
