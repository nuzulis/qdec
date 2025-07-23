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
      { headerName: "ID", field: "id", flex: 1 },
      { headerName: "Nama Penumpang", field: "nama_penumpang", flex: 1 },
      { headerName: "Negara Asal", field: "neg_asal", flex: 1 },
      { headerName: "Port Tujuan", field: "port_tuju", flex: 1 },
      { headerName: "Tanggal Tiba", field: "tgl_tiba", flex: 1 },
      { headerName: "MP", field: "bentuk_mp", flex: 1 },
      { headerName: "Respon", field: "respon", flex: 1 },
      { headerName: "Rekom Petugas", field: "rekom_petugas", flex: 1 },
      { headerName: "UPT", field: "upt", flex: 1 },
      {
        headerName: "Detail",
        field: "id",
        cellRenderer: (params: any) => {
          return (
            <button
              onClick={() => handleDetailClick(params.value)}
              className="bg-blue-500  text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Lihat
            </button>
          );
        },
        flex: 1.2,
      },
    ],
    [rowData]
  );

  return (
    <>
      <div
        className="ag-theme-alpine font-sans"
        style={{ height: 400, width: "100%" }}
      >
        <AgGridReact
          theme="legacy"
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
        />
           {" "}
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
