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
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface MonthlySalesChartProps {
  selectedUPT: string;
}

export default function MonthlySalesChart({
  selectedUPT,
}: MonthlySalesChartProps) {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const dFrom = "2025-01-01";
  const dTo = "2025-12-31";
  const username = "imigrasiok";
  const password = "6SyfPqjD68RRQKe";

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const url = "https://api3.karantinaindonesia.go.id/qdec/FindQDec";
      const params = {
        dFrom,
        dTo,
        upt: selectedUPT,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
        body: JSON.stringify(params),
      });

      const json = await response.json();

      if (!json.status || !Array.isArray(json.data)) {
        console.error("Invalid response or data format:", json);
        return;
      }

      const dataArray = json.data;

      const bulanMap = new Map<string, number>();

      dataArray.forEach((item: any) => {
        const tanggalStr = item.tgl_tiba || item.tgl_aju;
        if (!tanggalStr) return;

        let tanggal;
        try {
          tanggal = parseISO(tanggalStr);
        } catch (e) {
          console.error("Parse error:", tanggalStr);
          return;
        }

        if (isNaN(tanggal.getTime())) return;

        const bulan = format(tanggal, "MMM", { locale: id });
        const prev = bulanMap.get(bulan) || 0;
        bulanMap.set(bulan, prev + 1);
      });

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
      const labels = bulanUrut;
      const data = bulanUrut.map((b) => bulanMap.get(b) || 0);

      setChartData({
        labels,
        datasets: [
          {
            label: "Jumlah Deklarasi",
            data,
            backgroundColor: "#3B82F6",
            borderRadius: 6,
          },
        ],
      });
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedUPT]);
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-full">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Statistik Deklarasi per Bulan
      </h2>
      {isLoading ? (
        <div className="text-gray-500 dark:text-gray-300">Loading...</div>
      ) : (
        <div className="relative w-full h-[300px]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
