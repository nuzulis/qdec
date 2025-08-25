import { useEffect, useState } from "react";
import Select from "react-select";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";

const uptList = [
  { id: "1100", nama: "BKHIT Aceh" },
  { id: "1200", nama: "BBKHIT Sumatera Utara" },
  { id: "1300", nama: "BKHIT Sumatera Barat" },
  { id: "1400", nama: "BKHIT Riau" },
  { id: "1600", nama: "BKHIT Sumatera Selatan" },
  { id: "1800", nama: "BKHIT Lampung" },
  { id: "1900", nama: "BKHIT Kepulauan Bangka Belitung" },
  { id: "2100", nama: "BKHIT Kepulauan Riau" },
  { id: "3100", nama: "BBKHIT DKI Jakarta" },
  { id: "3200", nama: "BKHIT Jawa Barat" },
  { id: "3300", nama: "BKHIT Jawa Tengah" },
  { id: "3400", nama: "BKHIT Daerah Istimewa Yogyakarta" },
  { id: "3500", nama: "BKHIT Jawa Timur" },
  { id: "3600", nama: "BKHIT Banten" },
  { id: "5100", nama: "BBKHIT Bali" },
  { id: "5300", nama: "BKHIT Nusa Tenggara Timur" },
  { id: "6100", nama: "BKHIT Kalimantan Barat" },
  { id: "6300", nama: "BKHIT Kalimantan Selatan" },
  { id: "6400", nama: "BBKHIT Kalimantan Timur" },
  { id: "6500", nama: "BKHIT Kalimantan Utara" },
  { id: "7100", nama: "BKHIT Sulawesi Utara" },
  { id: "7200", nama: "BKHIT Sulawesi Tengah" },
  { id: "7300", nama: "BBKHIT Sulawesi Selatan" },
  { id: "8100", nama: "BKHIT Maluku" },
  { id: "9100", nama: "BBKHIT Papua" },
  { id: "9300", nama: "BKHIT Papua Selatan" },
  { id: "9600", nama: "BKHIT Papua Barat Daya" },
];

export default function Home() {
  const user = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") ?? "{}");
    } catch {
      return {};
    }
  })();

  const isSuperadmin = String(user.upt) === "1000";

  const [selectedUPT, setSelectedUPT] = useState<string>(
    isSuperadmin ? "" : String(user.upt || user.upt_id || "")
  );

  useEffect(() => {
    if (!isSuperadmin && (user.upt || user.upt_id)) {
      setSelectedUPT(String(user.upt || user.upt_id));
    }
  }, [isSuperadmin, user.upt, user.upt_id]);

  // Mapping untuk React Select
  const uptOptions = [
    { value: "", label: "-- Semua UPT --" },
    ...uptList.map((upt) => ({ value: upt.id, label: upt.nama })),
  ];

  return (
    <>
      <PageMeta
        title="QD Dashboard"
        description="This is QD Dashboard Karantina Indonesia"
      />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 space-y-6">
            {/* Filter UPT hanya untuk superadmin */}
            {isSuperadmin && (
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white/80">
                  Pilih UPT
                </label>
                <Select
                  options={uptOptions}
                  value={uptOptions.find((o) => o.value === selectedUPT)}
                  onChange={(option) => setSelectedUPT(option?.value || "")}
                  isClearable
                  placeholder="Pilih UPT..."
                />
              </div>
            )}

            <EcommerceMetrics
              selectedUPT={selectedUPT}
              isSuperadmin={isSuperadmin}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatisticsChart
                selectedUPT={selectedUPT}
                isSuperadmin={isSuperadmin}
              />
              <MonthlySalesChart
                selectedUPT={selectedUPT}
                isSuperadmin={isSuperadmin}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
