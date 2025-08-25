import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import DatePicker from "../date-picker";
import dayjs from "dayjs";

interface FilterExampleProps {
  onDataFiltered: (data: any[]) => void;
}

export default function FilterExample({ onDataFiltered }: FilterExampleProps) {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const isSuperAdmin = user.upt === 1000; // tetap cek sebagai number
  const [upt, setUpt] = useState(isSuperAdmin ? "all" : String(user.upt));

  const [dFrom, setDFrom] = useState(dayjs().format("YYYY-MM-DD"));
  const [dTo, setDTo] = useState(dayjs().format("YYYY-MM-DD"));
  const [isLoading, setIsLoading] = useState(false);

  const username = "imigrasiok";
  const password = "6SyfPqjD68RRQKe";
  const uptList = [
    { id: "5100", nama: "BBKHIT Bali" },
    { id: "3500", nama: "BKHIT Jawa Timur" },
    { id: "3600", nama: "BKHIT Banten" },
  ];
  const fetchData = async () => {
    try {
      setIsLoading(true);

      let targetUPTs: string[] = [];

      if (isSuperAdmin) {
        if (!upt || upt === "all") {
          targetUPTs = uptList.map((u) => u.id);
        } else {
          targetUPTs = [upt];
        }
      } else {
        targetUPTs = [upt];
      }

      const allData: any[] = [];

      for (const u of targetUPTs) {
        const params = {
          dFrom,
          dTo,
          upt: u,
        };

        const res = await fetch(
          `https://api3.karantinaindonesia.go.id/qdec/FindQDec`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa(`${username}:${password}`)}`,
            },
            body: JSON.stringify(params),
          }
        );

        const result = await res.json();
        if (result.status) {
          allData.push(...result.data);
        } else {
          console.warn("API Error:", result.message);
        }
      }

      onDataFiltered(allData);
    } catch (error) {
      console.error("Fetch error:", error);
      onDataFiltered([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ComponentCard title="Filter Deklarasi">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        {/* Tanggal Dari */}
        <div className="flex flex-col">
          <label
            htmlFor="tanggal-dari"
            className="text-sm font-medium mb-1 dark:text-white/90"
          >
            Tanggal Awal (From)
          </label>
          <DatePicker
            id="tanggal-dari"
            value={dFrom}
            onChange={setDFrom}
            className="w-full"
          />
        </div>

        {/* Tanggal Sampai */}
        <div className="flex flex-col">
          <label
            htmlFor="tanggal-sampai"
            className="text-sm font-medium mb-1 dark:text-white/90"
          >
            Tanggal Akhir (To)
          </label>
          <DatePicker
            id="tanggal-sampai"
            value={dTo}
            onChange={setDTo}
            className="w-full"
          />
        </div>

        {/* UPT */}
        {isSuperAdmin && (
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 dark:text-white/90">
              UPT
            </label>
            <select
              value={upt}
              onChange={(e) => setUpt(e.target.value)}
              className="h-11 w-full rounded-lg border ..."
            >
              <option value="all">Semua UPT</option>
              {uptList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tombol Filter */}
        <div className="flex items-end">
          <button
            onClick={fetchData}
            className="h-11 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg text-sm shadow-theme-xs"
          >
            {isLoading ? "Memuat..." : "Filter"}
          </button>
        </div>
      </div>
    </ComponentCard>
  );
}
