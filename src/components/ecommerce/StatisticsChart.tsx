import { useState, useEffect } from "react";

type DecRow = {
  tgl_tiba: string;
  nama_no_angkut: string;
  nama_pelabuhan: string;
  nama_penumpang: string;
  respon_text: string;
};

interface Props {
  selectedUPT: string;
  isSuperadmin: boolean;
}

export default function StatisticsChart({ selectedUPT, isSuperadmin }: Props) {
  const [rows, setRows] = useState<DecRow[]>([]);
  const [loading, setLoading] = useState(false);
  const uptParam = isSuperadmin
    ? selectedUPT || "all" // kalau superadmin & belum pilih, default "all"
    : selectedUPT;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const body = {
          dFrom: today,
          dTo: today,
          upt: uptParam,
        };

        const res = await fetch(
          "https://api3.karantinaindonesia.go.id/qdec/FindQDec",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Basic " + btoa("imigrasiok:6SyfPqjD68RRQKe"),
            },
            body: JSON.stringify(body),
          }
        );

        const data = await res.json();

        if (data?.status && Array.isArray(data?.data)) {
          // simpan semua data, sorting dilakukan di render
          setRows(data.data);
        } else {
          setRows([]);
        }
      } catch (err) {
        // console.error("Error fetching:", err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [selectedUPT, isSuperadmin]);
  const sortedRows = [...rows]
    .sort(
      (a, b) => new Date(b.tgl_tiba).getTime() - new Date(a.tgl_tiba).getTime()
    )
    .slice(0, 10);
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : sortedRows.length > 0 ? (
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Tanggal Tiba</th>
              <th className="px-4 py-2">Nomor Pesawat</th>
              <th className="px-4 py-2">Pelabuhan / Bandara</th>
              <th className="px-4 py-2">Nama Penumpang</th>
              <th className="px-4 py-2">Respon</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => (
              <tr key={i} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-2">
                  {new Date(row.tgl_tiba).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-2">{row.nama_no_angkut}</td>
                <td className="px-4 py-2">{row.nama_pelabuhan}</td>
                <td className="px-4 py-2 font-medium">{row.nama_penumpang}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    row.respon_text === "RILIS"
                      ? "text-green-600"
                      : row.respon_text === "TOLAK/Q-BIN"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {row.respon_text || "Belum Ada Respon"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="p-4">Tidak ada data</p>
      )}
    </div>
  );
}
