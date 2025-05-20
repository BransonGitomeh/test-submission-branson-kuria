
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { UfoSighting } from "@/types/ufo";
import moment from "moment";

interface UfoDailyTrendChartProps {
  data: UfoSighting[];
}

const UfoDailyTrendChart: React.FC<UfoDailyTrendChartProps> = ({ data }) => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => {
    const dateA = moment(a.date, "DD/MM/YYYY");
    const dateB = moment(b.date, "DD/MM/YYYY");
    return dateA.valueOf() - dateB.valueOf();
  });

  // Format dates for display
  const formattedData = sortedData.map(item => ({
    date: moment(item.date, "DD/MM/YYYY").format("MMM DD"),
    sightings: item.sightings,
    fullDate: item.date
  }));

  // Calculate 3-day moving average
  const movingAverageData = formattedData.map((item, index, array) => {
    if (index < 2) return { ...item, average: null };
    
    const sum = array[index].sightings + array[index-1].sightings + array[index-2].sightings;
    return {
      ...item,
      average: Math.round(sum / 3 * 10) / 10
    };
  });

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={movingAverageData}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
          />
          <YAxis 
            label={{ 
              value: 'Number of Sightings', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: '12px', textAnchor: 'middle' },
            }}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "average") return [value, "3-Day MA"];
              return [value, "Daily Sightings"];
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                return `Date: ${payload[0].payload.fullDate}`;
              }
              return label;
            }}
          />
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="sightings"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Daily Sightings"
          />
          <Line
            type="monotone"
            dataKey="average"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="3-Day Moving Average"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UfoDailyTrendChart;
