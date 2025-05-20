
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { UfoSighting } from "@/types/ufo";
import moment from "moment";

interface UfoMonthlyDistributionChartProps {
  data: UfoSighting[];
}

const UfoMonthlyDistributionChart: React.FC<UfoMonthlyDistributionChartProps> = ({ data }) => {
  const monthlyData = useMemo(() => {
    // Group data by month
    const groupedByMonth = data.reduce((acc, item) => {
      const month = moment(item.date, "DD/MM/YYYY").format("MMMM");
      
      if (!acc[month]) {
        acc[month] = {
          month,
          sightings: 0,
          days: 0,
        };
      }
      
      acc[month].sightings += item.sightings;
      acc[month].days += 1;
      
      return acc;
    }, {} as Record<string, { month: string; sightings: number; days: number }>);

    // Convert to array and calculate daily average
    return Object.values(groupedByMonth).map(({ month, sightings, days }) => ({
      month,
      totalSightings: sightings,
      dailyAverage: Math.round((sightings / days) * 10) / 10,
    }));
  }, [data]);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={monthlyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="totalSightings"
            fill="hsl(var(--primary))"
            name="Total Sightings"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          <Bar
            yAxisId="right"
            dataKey="dailyAverage"
            fill="hsl(var(--secondary))"
            name="Daily Average"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UfoMonthlyDistributionChart;
