import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";

interface StatisticsChartProps {
  selectedUPT: string;
}

const StatisticsChart = ({ selectedUPT }: StatisticsChartProps) => {
  const [series, setSeries] = useState([
    {
      name: "Jumlah Data",
      data: Array(12).fill(0),
    },
  ]);

  // const [loading, setLoading] = useState(true);

  const username = "imigrasiok";
  const password = "6SyfPqjD68RRQKe";
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedUPT) return;

      // setLoading(true);

      try {
        const response = await fetch(
          "https://api3.karantinaindonesia.go.id/qdec/FindQDec",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa(`${username}:${password}`)}`,
            },
            body: JSON.stringify({
              dFrom: "2025-01-01",
              dTo: "2025-12-31",
              upt: selectedUPT,
            }),
          }
        );

        const result = await response.json();

        if (result.status && result.data) {
          const monthlyCount = Array(12).fill(0);

          result.data.forEach((item: any) => {
            const createdAt = new Date(item.created_at);
            const month = createdAt.getMonth(); // 0 = Jan, 11 = Dec
            monthlyCount[month]++;
          });

          setSeries([
            {
              name: "Jumlah Data",
              data: monthlyCount,
            },
          ]);
        } else {
          console.error("API Error:", result.message);
          setSeries([
            {
              name: "Jumlah Data",
              data: Array(12).fill(0),
            },
          ]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setSeries([
          {
            name: "Jumlah Data",
            data: Array(12).fill(0),
          },
        ]);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, [selectedUPT]);

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: { curve: "straight", width: 2 },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      x: { format: "MMM" },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: { fontSize: "0px" },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistik Deklarasi Bulanan
          </h3>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;
