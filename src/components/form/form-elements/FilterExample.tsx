import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import DatePicker from "../date-picker";
import dayjs from "dayjs";

interface FilterExampleProps {
  onDataFiltered: (data: any[]) => void;
}

export default function FilterExample({ onDataFiltered }: FilterExampleProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <DatePicker
            id="tanggal-dari"
            label="Tanggal Awal (From)"
            value={dFrom}
            onChange={setDFrom}
          />
        </div>
        <div>
          <DatePicker
            id="tanggal-sampai"
            label="Tanggal Akhir (To)"
            value={dTo}
            onChange={setDTo}
          />
        </div>
        {isSuperAdmin && (
          <div>
            <label className="block text-sm font-medium">UPT</label>
            <select
              className="border border-gray-300 p-2 rounded"
              value={upt}
              onChange={(e) => setUpt(e.target.value)}
            >
              <option value="1000">Semua UPT</option>
              <option value="5100">BBKHIT Bali</option>
              <option value="3600">BKHIT Banten</option>
              <option value="3500">BKHIT Jawa Timur</option>
            </select>
          </div>
        )}
        <button
          onClick={fetchData}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
        >
          {isLoading ? "Memuat..." : "Filter"}
        </button>
      </div>
    </ComponentCard>
  );
}
