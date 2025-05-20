
import React, { useMemo } from "react";
import { UfoSighting } from "@/types/ufo";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { CalendarDays, CalendarIcon, ChartPie } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UfoSightingsSummaryProps {
  data: UfoSighting[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))"];

const UfoSightingsSummary: React.FC<UfoSightingsSummaryProps> = ({ data }) => {
  const stats = useMemo(() => {
    if (!data.length) return null;
    
    // Total sightings
    const totalSightings = data.reduce((sum, item) => sum + item.sightings, 0);
    
    // Find day with max sightings
    const maxSighting = data.reduce((max, item) => 
      item.sightings > max.sightings ? item : max, data[0]);
    
    // Find day with min sightings (excluding zero)
    const minSighting = data.reduce((min, item) => 
      (item.sightings < min.sightings && item.sightings > 0) ? item : min, 
      data.find(d => d.sightings > 0) || data[0]);
    
    // Calculate weekly distribution
    const weekdayDistribution = data.reduce((acc, item) => {
      const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
        new Date(item.date.split('/').reverse().join('-')).getDay()
      ];
      
      if (!acc[weekday]) acc[weekday] = 0;
      acc[weekday] += item.sightings;
      
      return acc;
    }, {} as Record<string, number>);
    
    const weekdayData = Object.entries(weekdayDistribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
    
    return {
      totalSightings,
      maxSighting,
      minSighting,
      weekdayData
    };
  }, [data]);

  if (!stats) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg">
          <span className="text-2xl font-bold">{stats.totalSightings}</span>
          <span className="text-sm text-muted-foreground">Total Sightings</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-secondary/10 rounded-lg">
          <span className="text-2xl font-bold">{stats.maxSighting.sightings}</span>
          <span className="text-sm text-muted-foreground">Peak Day</span>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Top Days Distribution</h4>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.weekdayData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
                label={({ name }) => name}
              >
                {stats.weekdayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} sightings`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Sightings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              {stats.maxSighting.date} (Max)
            </TableCell>
            <TableCell className="text-right">{stats.maxSighting.sightings}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              {stats.minSighting.date} (Min)
            </TableCell>
            <TableCell className="text-right">{stats.minSighting.sightings}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default UfoSightingsSummary;
