"use client";

import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

type Event = {
  id: string;
  summary?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
};

export default function KvizChart() {
  const [chartData, setChartData] = useState<(string | number)[][]>([
    ["Mesec", "Broj kvizova"], // header
  ]);

  useEffect(() => {
    // fetch događaja iz API-ja
    const fetchEvents = async () => {
      const res = await fetch("/api/kalendar");
      const data = await res.json();
      const items: Event[] = data.items || [];

      // broj kvizova po mesecima
      const counts: { [month: string]: number } = {};

      items.forEach((event) => {
        const dateStr = event.start.dateTime || event.start.date;
        if (!dateStr) return;

        const date = new Date(dateStr);
        const month = date.toLocaleString("sr-RS", { month: "long" });

        counts[month] = (counts[month] || 0) + 1;
      });

      // formiraj podatke za chart
      const chartRows: (string | number)[][] = [["Mesec", "Broj kvizova"]];
      for (const month of Object.keys(counts)) {
        chartRows.push([month, counts[month]]);
      }

      setChartData(chartRows);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📊 Broj kvizova po mesecima</h2>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={chartData}
        options={{
          title: "Pub kvizovi po mesecima",
          legend: { position: "none" },
          hAxis: { title: "Mesec" },
          vAxis: { title: "Broj kvizova" },
        }}
      />
    </div>
  );
}