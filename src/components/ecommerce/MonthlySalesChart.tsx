import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface MonthlySalesChartProps {
  selectedUPT: string;
  isSuperadmin?: boolean;
}

// Warna untuk tiap respon
const colors: Record<string, string> = {
  RILIS: "#10B981", // hijau
  PERIKSA: "#F59E0B", // oranye
  "TOLAK/Q-BIN": "#EF4444", // merah
};

export default function MonthlySalesChart({
  selectedUPT,
  isSuperadmin,
}: MonthlySalesChartProps) {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const tahun = "2025";
  const username = "imigrasiok";
  const password = "6SyfPqjD68RRQKe";

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = {
        bulan: "all",
        tahun,
        upt: isSuperadmin
          ? !selectedUPT || selectedUPT === "all"
            ? ""
            : selectedUPT
          : selectedUPT,
        kar: "",
      };

      const res = await fetch(
        "https://api3.karantinaindonesia.go.id/qdec/findQDec/dashboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
          body: JSON.stringify(params),
        }
      );

      const json = await res.json();
      if (!json.status || !Array.isArray(json.data)) {
        console.error("Invalid response:", json);
        setIsLoading(false);
        return;
      }

      // Label bulan urut
      const bulanUrut = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agt",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];

      // siapkan struktur data per respon
      const responList = ["RILIS", "PERIKSA", "TOLAK/Q-BIN"];

      const responData: Record<string, number[]> = {
        RILIS: Array(12).fill(0),
        PERIKSA: Array(12).fill(0),
        "TOLAK/Q-BIN": Array(12).fill(0),
      };

      // isi data sesuai API
      json.data.forEach((item: any) => {
        const idx = parseInt(item.bln, 10) - 1;
        if (idx < 0 || idx > 11) return;

        const key = item.respon_text?.toUpperCase();
        if (responData[key]) {
          responData[key][idx] = parseInt(item.jml, 10) || 0;
        }
      });

      setChartData({
        labels: bulanUrut,
        datasets: responList.map((r) => ({
          label: r,
          data: responData[r],
          backgroundColor: colors[r],
          borderRadius: 4,
        })),
      });
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedUPT, isSuperadmin]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-full min-h-[450px] flex flex-col">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Statistik Deklarasi per Bulan
      </h2>
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center text-gray-500 dark:text-gray-300">
          Loading...
        </div>
      ) : (
        <div className="relative w-full flex-grow">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: true } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      )}
    </div>
  );
}
