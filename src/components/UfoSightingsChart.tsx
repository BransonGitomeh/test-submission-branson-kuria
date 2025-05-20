
import React, { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUfoSightings } from "@/services/ufoService";
import { groupSightingsByWeek, formatDateRange, getDayName, getWeekNumber } from "@/utils/dateUtils";
import { WeeklySightings } from "@/types/ufo";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";

const UfoSightingsChart = () => {
  const [weeklySightings, setWeeklySightings] = useState<WeeklySightings[]>([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const sightings = await fetchUfoSightings();
        const groupedSightings = groupSightingsByWeek(sightings);
        
        setWeeklySightings(groupedSightings);
        setCurrentWeekIndex(groupedSightings.length - 1);
      } catch (err) {
        setError("Failed to fetch UFO sightings data. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load UFO sightings data."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  const navigateWeek = (direction: number) => {
    const newIndex = currentWeekIndex + direction;
    
    if (newIndex >= 0 && newIndex < weeklySightings.length) {
      setCurrentWeekIndex(newIndex);
    }
  };
  
  const currentWeek = weeklySightings[currentWeekIndex];
  
  const weekNumber = currentWeek ? getWeekNumber(currentWeek.startDate) : null;
  
  const chartData = currentWeek?.dailySightings.map((day) => ({
    day: getDayName(day.date),
    sightings: day.sightings,
    fullDate: day.date,
  }));
  
  const renderCustomAxisTick = ({ x, y, payload }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#666"
          fontSize="12px"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle className="text-xl sm:text-2xl">UFO Sightings</CardTitle>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm sm:text-base">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek(-1)}
              disabled={currentWeekIndex === 0 || isLoading}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous Week
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek(1)}
              disabled={currentWeekIndex === weeklySightings.length - 1 || isLoading}
            >
              Next Week <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          {currentWeek && (
            <div className="text-center font-medium">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mr-2">
                Week {weekNumber}
              </span>
              {`${moment(currentWeek.startDate).format('MMM D')} - ${moment(currentWeek.endDate).format('MMM D')}`}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-2 sm:p-6">
        {isLoading ? (
          <div className="flex h-80 items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading UFO sightings data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-80 items-center justify-center">
            <div className="text-center">
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="day" 
                tick={renderCustomAxisTick}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis 
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                tickCount={5}
                label={{ 
                  value: 'Number of Sightings', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' },
                  offset: 0
                }}
              />
              <Tooltip 
                formatter={(value, name) => [value, 'Sightings']}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    const item = payload[0].payload;
                    return `${label}, ${new Date(item.fullDate).toLocaleDateString()}`;
                  }
                  return label;
                }}
              />
              <Legend />
              <Bar 
                dataKey="sightings" 
                name="UFO Sightings" 
                fill="hsl(var(--ufo-accent))" 
                radius={[4, 4, 0, 0]}
                barSize={40}
                animationDuration={500}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-80 items-center justify-center">
            <p className="text-muted-foreground">No sightings data available for this period.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UfoSightingsChart;
