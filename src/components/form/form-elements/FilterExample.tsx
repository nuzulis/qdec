import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import DatePicker from "../date-picker";
import dayjs from "dayjs";

interface FilterExampleProps {
  onDataFiltered: (data: any[]) => void;
}

export default function FilterExample({ onDataFiltered }: FilterExampleProps) {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const isSuperAdmin = user.upt === 1000;

  const [dFrom, setDFrom] = useState(dayjs().format("YYYY-MM-DD"));
  const [dTo, setDTo] = useState(dayjs().format("YYYY-MM-DD"));
  const [upt, setUpt] = useState(user.upt);
  const [isLoading, setIsLoading] = useState(false);
  // const [data, setData] = useState<any[]>([]);

  const username = "imigrasiok";
  const password = "6SyfPqjD68RRQKe";

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const url = `https://api3.karantinaindonesia.go.id/qdec/FindQDec`;
      const params = {
        dFrom,
        dTo,
        upt,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
        body: JSON.stringify(params),
      });

      const result = await res.json();
      if (result.status) {
        // setData(result.data);
        onDataFiltered(result.data);
      } else {
        console.warn("API Error:", result.message);
        // setData([]);
        onDataFiltered([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data default saat load
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
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              value={upt}
              onChange={(e) => setUpt(e.target.value)}
            >
              <option value="">PILIH UPT</option>
              <option value="5100">BBKHIT Bali</option>
              <option value="3600">BKHIT Banten</option>
              <option value="3500">BKHIT Jawa Timur</option>
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
