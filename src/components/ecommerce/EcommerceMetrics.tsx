import { ComponentType, SVGProps, useEffect, useState } from "react";
import {
  CheckCircleIcon,
  MagnifyingGlassCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
interface EcommerceMetricsProps {
  selectedUPT: string;
}

interface MetricData {
  label: string;
  value: number;
  color: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>; // tambahkan ini
}

const EcommerceMetrics = ({ selectedUPT }: EcommerceMetricsProps) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const isSuperadmin = user.upt === 1000;
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isSuperadmin && !selectedUPT) {
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
          "https://api3.karantinaindonesia.go.id/qdec/findQDec/dashPetugas",
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

          const d = data[0];
          const rilis = Number(d.rilis) || 0;
          const periksa = Number(d.periksa) || 0;
          const tolak_qbin = Number(d.tolak_qbin) || 0;
          const belum = Number(d.belum) || 0;

          setMetrics([
            {
              label: "Total Bulan Ini",
              value: rilis + periksa + tolak_qbin + belum,
              color: "bg-blue-500",
              icon: ChartBarIcon,
            },
            {
              label: "Rilis Bulan Ini",
              value: rilis,
              color: "bg-green-500",
              icon: CheckCircleIcon,
            },
            {
              label: "Periksa Lanjut Bulan Ini",
              value: periksa,
              color: "bg-yellow-500",
              icon: MagnifyingGlassCircleIcon,
            },
            {
              label: "Quarantine Bin Bulan Ini",
              value: tolak_qbin,
              color: "bg-red-500",
              icon: XCircleIcon,
            },
            {
              label: "Belum Respon Bulan Ini",
              value: belum,
              color: "bg-purple-500",
              icon: ClockIcon,
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
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
      {loading ? (
        <div className="col-span-5 flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
        </div>
      ) : error ? (
        <p className="col-span-5 text-center text-red-500 font-medium">
          {error}
        </p>
      ) : (
        metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className={`rounded-xl p-5 shadow-lg text-white flex items-center space-x-4 ${metric.color}`}
            >
              <Icon className="h-10 w-10 opacity-80" />
              <div>
                <div className="text-sm font-medium">{metric.label}</div>
                <div className="text-2xl font-bold">
                  {" "}
                  {metric.value.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default EcommerceMetrics;
