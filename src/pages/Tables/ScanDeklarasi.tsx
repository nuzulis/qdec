import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CariDeklarasi from "../../components/common/CariDeklarasi";
import ScannedResult from "../../components/common/ScannedResult";

export interface DeklarasiResult {
  id_permohonan: string;
  payload: any;
  created_at: string;
  respon: string;
  respon_text: string;
}

export default function ScanDeklarasi() {
  const [data, setData] = useState<any | null>(null);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [respon, setRespon] = useState<string>("");
  const [responText, setResponText] = useState<string>("");

  const handleDataFetched = (result: DeklarasiResult) => {
    setData(result.payload);
    setCreatedAt(result.created_at);
    setRespon(result.respon);
    setResponText(result.respon_text);
  };

  return (
    <>
      <PageMeta
        title="Scan Deklarasi"
        description="Scan QR atau input manual ID Permohonan"
      />
      <PageBreadcrumb pageTitle="Scan Deklarasi" />

      <div className="space-y-6">
        <CariDeklarasi onSubmit={handleDataFetched} />
        {data && (
          <ScannedResult data={data} createdAt={createdAt} respon={respon} responText={responText} />
        )}
      </div>
    </>
  );
}
