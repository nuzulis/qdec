import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import DatePicker from "../date-picker.tsx";

interface FilterExampleProps {
  onDataFiltered: (data: any[]) => void;
}

export default function FilterExample({ onDataFiltered }: FilterExampleProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userUPT = String(user.upt || "");
  const [selectedUPT, setSelectedUPT] = useState(userUPT);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const daftarUPT = [
    { kode: "3100", nama: "Karantina Jakarta" },
    { kode: "3200", nama: "Karantina Jawa Timur" },
    { kode: "5100", nama: "Karantina Bali" },
  ];

  // console.log("User login:", user);
  // console.log("UPT user:", userUPT);
  const handleDateChange = (field: "start" | "end", value: string) => {
    if (field === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }

    const start = field === "start" ? new Date(value) : new Date(startDate);
    const end = field === "end" ? new Date(value) : new Date(endDate);

    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
      const diffMs = end.getTime() - start.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays > 30) {
        setError("Rentang tanggal tidak boleh lebih dari 30 hari.");
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!error && selectedUPT && startDate && endDate) {
      setLoading(true);

      try {
        const username = "imigrasiok";
        const password = "6SyfPqjD68RRQKe";
        const credentials = btoa(`${username}:${password}`);

        const bodyData =
          userUPT === "1000"
            ? {
                dFrom: startDate,
                dTo: endDate,
                ...(selectedUPT && { upt: selectedUPT }),
              }
            : {
                dFrom: startDate,
                dTo: endDate,
                upt: userUPT,
              };

        const response = await fetch(
          "https://api3.karantinaindonesia.go.id/qdec/FindQDec",
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${credentials}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          }
        );

        const json = await response.json();

        const mapped = (json.data || []).map((item: any) => ({
          nama: item.nama_penumpang,
          countryOfOrigin: item.neg_asal,
          flightNumber: item.nama_no_angkut || "-",
          place: item.port_tuju,
          dateArrive: item.tgl_aju,
          comodites: item.payload || "-",
          statusDeklarasi: item.respon || "-",
          rekomPetugas: "-",
        }));

        onDataFiltered(mapped);
      } catch (err) {
        console.error("Fetch error:", err);
        onDataFiltered([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ComponentCard title="Filter Data">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-end">
          {/* UPT */}
          <div>
            {userUPT === "1000" && (
              <div>
                <Label>Filter UPT</Label>
                <select
                  value={selectedUPT}
                  onChange={(e) => setSelectedUPT(e.target.value)}
                  className="w-full mt-1 px-3 py-[10px] border rounded-md text-sm h-[40px] bg-white dark:bg-gray-800 text-black dark:text-white"
                >
                  <option value="">-- Semua UPT --</option>
                  {daftarUPT.map((upt) => (
                    <option key={upt.kode} value={upt.kode}>
                      {upt.nama}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Tanggal Awal */}
          <div>
            <DatePicker
              id="date-picker-start"
              label="Tanggal Awal"
              placeholder="Pilih tanggal"
              onChange={(_, currentDateString) => {
                handleDateChange("start", currentDateString);
              }}
            />
          </div>

          {/* Tanggal Akhir */}
          <div>
            <DatePicker
              id="date-picker-end"
              label="Tanggal Akhir"
              placeholder="Pilih tanggal"
              onChange={(_, currentDateString) => {
                handleDateChange("end", currentDateString);
              }}
            />
          </div>

          {/* Tombol Filter */}
          <div>
            <button
              type="submit"
              disabled={
                !startDate ||
                !endDate ||
                !!error ||
                (userUPT === "1000" && !selectedUPT)
              }
              className="w-full bg-blue-800 text-white px-4 py-3 rounded-md hover:bg-blue-700 text-sm disabled:opacity-50"
            >
              {loading ? "Memuat..." : "Filter"}
            </button>
          </div>
        </div>

        {/* Pesan Error */}
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      </form>
    </ComponentCard>
  );
}
