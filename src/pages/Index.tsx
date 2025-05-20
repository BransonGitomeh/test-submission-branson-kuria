
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UfoSightingsChart from "@/components/UfoSightingsChart";
import UfoSightingsDashboard from "@/components/UfoSightingsDashboard";
import { CalendarDays, ChartBar, LayoutDashboard } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          UFO Sightings Tracker
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore UFO sightings data from around the world
        </p>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            <span>Weekly Chart</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-0">
          <UfoSightingsDashboard />
        </TabsContent>
        <TabsContent value="weekly" className="mt-0">
          <div className="mx-auto max-w-7xl">
            <UfoSightingsChart />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
