import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CustomAgGridRemoteTable from "../../components/tables/BasicTables/CustomAgGridRemoteTable";
import FilterExample from "../../components/form/form-elements/FilterExample";
export default function BasicTables() {
  const [filteredData, setFilteredData] = useState<any[]>([]);

  return (
    <>
      <PageMeta
        title="qd dashboard"
        description="This is qd dashboard Karantina Indonesia"
      />
      <PageBreadcrumb pageTitle="Card Arrival Declaration" />

      <div className="space-y-6">
        <FilterExample onDataFiltered={setFilteredData} />

        <CustomAgGridRemoteTable rowData={filteredData} />
      </div>
    </>
  );
}
