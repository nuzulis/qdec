import { useState, useEffect } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";

import PageMeta from "../../components/common/PageMeta";

// Daftar UPT manual
const uptList = [
  { id: "5100", nama: "BBKHIT Bali" },
  { id: "3500", nama: "BKHIT Jawa Timur" },
  { id: "3600", nama: "BKHIT Banten" },
];

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.upt === 1000;

  const [selectedUPT, setSelectedUPT] = useState(() => {
    return isAdmin ? "" : user?.upt_id || "";
  });

  useEffect(() => {
    if (!isAdmin && user?.upt_id) {
      setSelectedUPT(user.upt_id);
    }
  }, [isAdmin, user]);

  return (
    <>
      <PageMeta
        title="qd dashboard"
        description="This is qd dashboard Karantina Indonesia"
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 space-y-6">
            {isAdmin && (
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white/80">
                  Pilih UPT
                </label>
                <select
                  value={selectedUPT}
                  onChange={(e) => setSelectedUPT(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-- Pilih UPT --</option>
                  {uptList.map((upt) => (
                    <option key={upt.id} value={upt.id}>
                      {upt.nama}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <EcommerceMetrics selectedUPT={selectedUPT} />

            <MonthlySalesChart selectedUPT={selectedUPT} />
          </div>
        </div>
      </div>
    </>
  );
}
