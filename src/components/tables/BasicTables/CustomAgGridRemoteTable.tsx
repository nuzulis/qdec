import { AgGridReact } from "ag-grid-react";
import { useMemo, useState } from "react";

// Modul AG Grid versi 34+
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DetailModal from "../../ui/modal/modal";

export default function CustomAgGridRemoteTable({
  rowData,
}: {
  rowData: any[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const handleDetailClick = (id: string) => {
    const found = rowData.find((item) => item.id === id);
    if (found) {
      setSelectedData(found);
      setShowModal(true);
    }
  };

  const columnDefs = useMemo(
    () => [
      { headerName: "Nomor QR", field: "id_qr", flex: 1 },
      { headerName: "Nama Penumpang", field: "nama_penumpang", flex: 1 },
      { headerName: "Negara Asal", field: "neg_asal", flex: 1 },
      { headerName: "Port Tujuan", field: "port_tuju", flex: 1 },
      { headerName: "Nomor Voyage", field: "nama_no_angkut", flex: 1 },
      { headerName: "Tanggal Tiba", field: "tgl_tiba", flex: 1 },
      {
        headerName: "MP",
        flex: 1,
        cellRenderer: (params: any) => {
          const jenis = params.data.jns_karantina || "";
          const bentuk = params.data.bentuk_mp_id || "";
          return `${jenis} - ${bentuk}`;
        },
      },

      {
        headerName: "Respon",
        field: "respon_text",
        flex: 1,
        cellRenderer: ({ value }: any) => {
          const val = value?.toUpperCase();

          const getColorClass = () => {
            switch (val) {
              case "PERIKSA":
                return "bg-yellow-200 text-yellow-800";
              case "RILIS":
                return "bg-green-200 text-green-800";
              case "TOLAK":
              case "Q-BIN":
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
      },

      { headerName: "Rekom Petugas", field: "rekom_petugas_text", flex: 1 },

      {
        headerName: "Detail",
        field: "id",
        flex: 1.2,
        cellRenderer: (params: any) => {
          return (
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mx-auto block"
              onClick={() => handleDetailClick(params.value)}
            >
              Lihat
            </button>
          );
        },
      },
    ],
    [rowData]
  );

  // Handle global event dari tombol "Lihat" karena tombol dibuat via string HTML
  useState(() => {
    const handler = (e: any) => handleDetailClick(e.detail);
    document.addEventListener("detailClick", handler);
    return () => document.removeEventListener("detailClick", handler);
  });

  return (
    <>
      <div
        className="ag-theme-alpine font-sans"
        style={{ height: 400, width: "100%" }}
      >
        <AgGridReact
          theme="legacy"
          enableCellTextSelection={true}
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
        />
      </div>

      {showModal && (
        <DetailModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          data={selectedData}
        />
      )}
    </>
  );
}
