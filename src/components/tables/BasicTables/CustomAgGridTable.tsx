import { useState, useMemo } from "react";
import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

export type ICar = {
  make: string;
  model: string;
  price: number;
  electric: boolean;
};

ModuleRegistry.registerModules([AllCommunityModule]);

function CustomAgGridTable() {
  const [rowData] = useState<ICar[]>([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
  ]);

  const [colDefs] = useState<ColDef<ICar>[]>([
    { field: "make", editable: true, filter: true },
    { field: "model" },
    { field: "price", editable: true },
    { field: "electric" },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}

export default CustomAgGridTable;
