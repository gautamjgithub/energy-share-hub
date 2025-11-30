import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Plus, Battery, MapPin, Clock, 
  Zap, DollarSign, Car, Star, Activity, Loader2 
} from "lucide-react";
import CreateRequestDialog from "@/components/dialogs/CreateRequestDialog";
import RegisterCarDialog from "@/components/dialogs/RegisterCarDialog";
import ProviderMapView from "@/components/maps/ProviderMapView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient, Car as ApiCar, ChargingRequest } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface ConsumerDashboardProps {
  onBack: () => void;
  userId: string;
}

const ConsumerDashboard = ({ onBack, userId }: ConsumerDashboardProps) => {
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [showRegisterCar, setShowRegisterCar] = useState(false);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [cars, setCars] = useState<ApiCar[]>([]);
  const [requests, setRequests] = useState<ChargingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const walletBalance = 247.50;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allCars, allRequests] = await Promise.all([
        apiClient.getAllCars(),
        apiClient.getAllChargingRequests(),
      ]);
      
      const userCars = allCars.filter(car => car.user_id === userId);
      setCars(userCars);
      
      const userRequests = allRequests.filter(req => 
        userCars.some(car => car.car_id === req.consumer_car_id)
      );
      setRequests(userRequests);
      
      if (userCars.length > 0 && !selectedCar) {
        setSelectedCar(userCars[0].car_id);
      }
    } catch (error: any) {
      toast({
        title: "Load Failed",
        description: error.message || "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "requested": return "bg-status-requested";
      case "accepted": return "bg-status-accepted";
      case "in_progress": return "bg-status-progress";
      case "completed": return "bg-status-completed";
      default: return "bg-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Consumer Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your energy requests</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Card className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-secondary" />
                  <span className="font-semibold">${walletBalance.toFixed(2)}</span>
                </div>
              </Card>
              {selectedCar && (
                <Button className="gradient-primary" onClick={() => setShowCreateRequest(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">
              <Activity className="mr-2 h-4 w-4" />
              Active Requests ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="map">
              <MapPin className="mr-2 h-4 w-4" />
              Provider Map
            </TabsTrigger>
            <TabsTrigger value="cars">
              <Car className="mr-2 h-4 w-4" />
              My Cars ({cars.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            {requests.length === 0 ? (
              <Card className="p-12 text-center">
                <Battery className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Requests</h3>
                <p className="text-muted-foreground mb-6">
                  Create a new request to find nearby energy providers
                </p>
                {cars.length === 0 ? (
                  <Button className="gradient-primary" onClick={() => setShowRegisterCar(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Register a Car First
                  </Button>
                ) : (
                  <Button className="gradient-primary" onClick={() => setShowCreateRequest(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Request
                  </Button>
                )}
              </Card>
            ) : (
              requests.map((request) => (
                <Card key={request.request_id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{request.request_id}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {request.location.lat.toFixed(4)}, {request.location.lon.toFixed(4)}
                        </span>
                        {request.estimated_time_min && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {request.estimated_time_min} min
                          </span>
                        )}
                      </div>
                    </div>
                    {request.status === "in_progress" && (
                      <Button size="sm" onClick={loadData}>Refresh</Button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Energy Needed</div>
                      <div className="font-semibold">{request.requested_energy_kwh} kWh</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Price/kWh</div>
                      <div className="font-semibold">${request.price_per_kwh}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Total</div>
                      <div className="font-semibold text-secondary">
                        ${(request.requested_energy_kwh * request.price_per_kwh).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map">
            <ProviderMapView />
          </TabsContent>

          {/* My Cars Tab */}
          <TabsContent value="cars" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowRegisterCar(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Register New Car
              </Button>
            </div>
            
            {cars.length === 0 ? (
              <Card className="p-12 text-center">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Cars Registered</h3>
                <p className="text-muted-foreground mb-6">
                  Register your first vehicle to start requesting energy
                </p>
                <Button className="gradient-primary" onClick={() => setShowRegisterCar(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Register Car
                </Button>
              </Card>
            ) : (
              cars.map((car) => (
                <Card key={car.car_id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                        <Car className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{car.car_type}</h3>
                        <p className="text-sm text-muted-foreground">{car.car_id}</p>
                      </div>
                    </div>
                    <Button 
                      variant={selectedCar === car.car_id ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedCar(car.car_id)}
                    >
                      {selectedCar === car.car_id ? "Selected" : "Select"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Battery</div>
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-energy-high" />
                        <span className="font-semibold">{car.current_soc_percent}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Capacity</div>
                      <div className="font-semibold">{car.battery_capacity_kwh} kWh</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Max Output</div>
                      <div className="font-semibold">{car.max_output_kw} kW</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Max Input</div>
                      <div className="font-semibold">{car.max_input_kw} kW</div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedCar && (
        <CreateRequestDialog 
          open={showCreateRequest} 
          onOpenChange={setShowCreateRequest}
          carId={selectedCar}
          onSuccess={loadData}
        />
      )}
      
      <RegisterCarDialog
        open={showRegisterCar}
        onOpenChange={setShowRegisterCar}
        userId={userId}
        onSuccess={loadData}
      />
    </div>
  );
};

export default ConsumerDashboard;
