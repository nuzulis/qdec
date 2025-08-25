import { useEffect, useState } from "react";

interface EcommerceMetricsProps {
  selectedUPT: string;
  isSuperadmin?: boolean;
}

interface MetricData {
  label: string;
  value: number;
  color: string;
}

const EcommerceMetrics = ({
  selectedUPT,
  isSuperadmin,
}: EcommerceMetricsProps) => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isSuperadmin && !selectedUPT) {
        setError("UPT tidak boleh kosong untuk user biasa.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const now = new Date();
      const bulan = String(now.getMonth() + 1).padStart(2, "0");
      const tahun = String(now.getFullYear());

      const username = "imigrasiok";
      const password = "6SyfPqjD68RRQKe";

      try {
        const response = await fetch(
          "https://api3.karantinaindonesia.go.id/qdec/findQDec/dashboard",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa(`${username}:${password}`)}`,
            },
            body: JSON.stringify({
              bulan,
              tahun,
              upt: selectedUPT || "",
              kar: "",
            }),
          }
        );

        const result = await response.json();

        if (
          result.status &&
          result.code === 200 &&
          Array.isArray(result.data)
        ) {
          const data = result.data;

          if (data.length === 0) {
            setMetrics([]);
            setError("Tidak ada data untuk periode ini.");
            return;
          }

          let rilis = 0;
          let periksa = 0;
          let qbin = 0;

          for (const d of data) {
            if (d.respon_text === "RILIS") rilis += Number(d.jml);
            else if (d.respon_text === "PERIKSA") periksa += Number(d.jml);
            else if (d.respon_text === "TOLAK/Q-BIN") qbin += Number(d.jml);
          }

          setMetrics([
            {
              label: "Total Bulan Ini",
              value: rilis + periksa + qbin,
              color: "bg-blue-500",
            },
            {
              label: "Rilis Bulan Ini",
              value: rilis,
              color: "bg-green-500",
            },
            {
              label: "Periksa Lanjut Bulan Ini",
              value: periksa,
              color: "bg-yellow-500",
            },
            {
              label: "Quarantine Bin Bulan Ini",
              value: qbin,
              color: "bg-red-500",
            },
          ]);
        } else {
          setError(result.message || "Gagal memuat data.");
          setMetrics([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Terjadi kesalahan saat mengambil data.");
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedUPT, isSuperadmin]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {loading ? (
        <div className="col-span-4 flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
        </div>
      ) : error ? (
        <p className="col-span-4 text-center text-red-500">{error}</p>
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
