import { useEffect, useState } from "react";

interface EcommerceMetricsProps {
  selectedUPT: string;
}

interface MetricData {
  label: string;
  value: number;
  color: string;
}

const EcommerceMetrics = ({ selectedUPT }: EcommerceMetricsProps) => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedUPT) return;

      setLoading(true);

      const dFrom = "2025-01-01";
      const dTo = "2025-12-31";

      const username = "imigrasiok";
      const password = "6SyfPqjD68RRQKe";

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
              dFrom,
              dTo,
              upt: selectedUPT,
            }),
          }
        );

        const result = await response.json();

        if (result.status && result.code === 200) {
          const data = result.data;
          const summaryMetrics: MetricData[] = [
            {
              label: "Total Data",
              value: data.length,
              color: "bg-blue-500",
            },
            {
              label: "Total Rilis",
              value: data.filter((d: any) => d.respon_text === "RILIS").length,
              color: "bg-green-500",
            },
            {
              label: "Total Periksa Lanjut",
              value: data.filter((d: any) => d.respon_text === "PERIKSA")
                .length,
              color: "bg-yellow-500",
            },

            {
              label: "Total Karantina Bin",
              value: data.filter((d: any) => d.respon_text === "TOLAK/Q-BIN")
                .length,
              color: "bg-red-500",
            },
          ];
          setMetrics(summaryMetrics);
        } else {
          console.error("API error:", result.message);
          setMetrics([]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedUPT]);

  if (!selectedUPT) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {loading ? (
        <p className="col-span-4 text-center text-gray-500">Loading...</p>
      ) : (
        metrics.map((metric, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 shadow-md text-white ${metric.color}`}
          >
            <div className="text-sm font-medium">{metric.label}</div>
            <div className="text-2xl font-bold">{metric.value}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default EcommerceMetrics;
