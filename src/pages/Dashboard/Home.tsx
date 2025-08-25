import { useState, useEffect } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";

const uptList = [
  { id: "51", nama: "BBKHIT Bali" },
  { id: "35", nama: "BKHIT Jawa Timur" },
  { id: "36", nama: "BKHIT Banten" },
  { id: "21", nama: "BKHIT Kepulauan Riau" },
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
    isSuperadmin ? "" : user?.upt_id || ""
  );

  // Pastikan nilai selectedUPT ter-set sesuai role
  useEffect(() => {
    if (!isSuperadmin && user?.upt_id) {
      setSelectedUPT(user.upt_id);
    }
  }, [isSuperadmin, user?.upt_id]);

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
                <select
                  value={selectedUPT}
                  onChange={(e) => setSelectedUPT(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- Semua UPT --</option>
                  {uptList.map((upt) => (
                    <option key={upt.id} value={upt.id}>
                      {upt.nama}
                    </option>
                  ))}
                </select>
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
