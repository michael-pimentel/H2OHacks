import type { ReservoirDataPoint, ReservoirWithData } from "@/types";
import { RESERVOIRS, generateReservoirHistory } from "./seedData";

interface CDECRecord {
  stationId: string;
  durCode: string;
  sensorNum: string;
  date: string;
  value: string;
  dataFlag: string;
  units: string;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getStatus(pct: number): ReservoirWithData["status"] {
  if (pct >= 60) return "healthy";
  if (pct >= 45) return "watch";
  if (pct >= 30) return "warning";
  return "critical";
}

async function fetchCDEC(stationId: string): Promise<ReservoirDataPoint[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 365);

  const url =
    `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet` +
    `?Stations=${stationId}&SensorNums=15&dur_code=D` +
    `&Start=${formatDate(start)}&End=${formatDate(end)}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`CDEC responded ${res.status}`);

  const raw: CDECRecord[] = await res.json();

  return raw
    .filter((r) => r.value && r.value !== "---" && !isNaN(parseFloat(r.value)))
    .map((r) => ({
      date: r.date.slice(0, 10),
      storageAF: Math.round(parseFloat(r.value)),
    }))
    .filter((p) => p.storageAF > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchAllReservoirs(): Promise<ReservoirWithData[]> {
  return Promise.all(
    RESERVOIRS.map(async (reservoir) => {
      let history: ReservoirDataPoint[];
      let dataSource: "live" | "estimated" = "estimated";

      try {
        const fetched = await fetchCDEC(reservoir.id);
        if (fetched.length >= 10) {
          history = fetched;
          dataSource = "live";
        } else {
          history = generateReservoirHistory(reservoir.capacityAF, reservoir.id);
        }
      } catch {
        history = generateReservoirHistory(reservoir.capacityAF, reservoir.id);
      }

      const currentAF = history[history.length - 1]?.storageAF ?? 0;
      const percentFull = Math.round((currentAF / reservoir.capacityAF) * 100);

      return {
        ...reservoir,
        currentAF,
        percentFull,
        status: getStatus(percentFull),
        history,
        loading: false,
        dataSource,
      };
    })
  );
}

export function getSeededReservoirs(): ReservoirWithData[] {
  return RESERVOIRS.map((reservoir) => {
    const history = generateReservoirHistory(reservoir.capacityAF, reservoir.id);
    const currentAF = history[history.length - 1]?.storageAF ?? 0;
    const percentFull = Math.round((currentAF / reservoir.capacityAF) * 100);
    return {
      ...reservoir,
      currentAF,
      percentFull,
      status: getStatus(percentFull),
      history,
      loading: false,
      dataSource: "estimated" as const,
    };
  });
}
