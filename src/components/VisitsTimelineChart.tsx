import { Company } from "@/types/company";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface VisitsTimelineChartProps {
  companies: Company[];
}

const VisitsTimelineChart = ({ companies }: VisitsTimelineChartProps) => {
  // Préparation des données pour le graphique
  const timeSlots = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    visits: 0,
    label: `${i.toString().padStart(2, '0')}:00`
  }));

  companies.forEach(company => {
    if (company.scheduledTime) {
      const hour = parseInt(company.scheduledTime.split(':')[0]);
      const slot = timeSlots.find(slot => slot.hour === hour);
      if (slot) {
        slot.visits += 1;
      }
    }
  });

  // Filtrer pour n'afficher que les heures avec des visites et quelques heures avant/après
  const relevantTimeSlots = timeSlots.filter(slot => {
    const hasVisitsNearby = timeSlots.some(
      s => Math.abs(s.hour - slot.hour) <= 2 && s.visits > 0
    );
    return hasVisitsNearby;
  });

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={relevantTimeSlots}>
          <XAxis 
            dataKey="label" 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Heure
                        </span>
                        <span className="font-bold">
                          {payload[0].payload.label}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Visites
                        </span>
                        <span className="font-bold">
                          {payload[0].value}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="visits"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitsTimelineChart;