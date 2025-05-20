
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchUfoSightings } from "@/services/ufoService";
import { useToast } from "@/hooks/use-toast";
import UfoDailyTrendChart from "./charts/UfoDailyTrendChart";
import UfoMonthlyDistributionChart from "./charts/UfoMonthlyDistributionChart";
import UfoSightingsSummary from "./charts/UfoSightingsSummary";
import { InfoIcon } from "lucide-react";

const UfoSightingsDashboard = () => {
  const { toast } = useToast();
  
  const { data: ufoSightings, isLoading, error } = useQuery({
    queryKey: ['ufoSightings'],
    queryFn: fetchUfoSightings,
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load UFO sightings data."
      });
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full min-h-[400px] place-items-center">
        <div className="text-center col-span-full">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading UFO sightings data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full min-h-[400px] place-items-center">
        <div className="text-center col-span-full">
          <p className="text-destructive">Failed to fetch UFO sightings data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            Daily UFO Sightings Trend
          </CardTitle>
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <UfoDailyTrendChart data={ufoSightings || []} />
        </CardContent>
      </Card>
      
      <Card className="col-span-full md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            Sightings Summary
          </CardTitle>
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <UfoSightingsSummary data={ufoSightings || []} />
        </CardContent>
      </Card>
      
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            Monthly Distribution
          </CardTitle>
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <UfoMonthlyDistributionChart data={ufoSightings || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UfoSightingsDashboard;
