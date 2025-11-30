import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Battery, TrendingUp, Zap, 
  DollarSign, Clock, CheckCircle, AlertCircle, Loader2, Plus 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient, Car as ApiCar, ChargingRequest } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import RegisterCarDialog from "@/components/dialogs/RegisterCarDialog";

interface ProviderDashboardProps {
  onBack: () => void;
  userId: string;
}

const ProviderDashboard = ({ onBack, userId }: ProviderDashboardProps) => {
  const [showRegisterCar, setShowRegisterCar] = useState(false);
  const [cars, setCars] = useState<ApiCar[]>([]);
  const [requests, setRequests] = useState<ChargingRequest[]>([]);
  const [activeTransactions, setActiveTransactions] = useState<ChargingRequest[]>([]);
  const [loading, setLoading] = useState(true);

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
      
      const pendingRequests = allRequests.filter(req => req.status === "requested");
      setRequests(pendingRequests);
      
      const active = allRequests.filter(req => 
        req.status === "accepted" || req.status === "in_progress"
      );
      setActiveTransactions(active);
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

  const handleAcceptRequest = async (requestId: string, providerCarId: string) => {
    try {
      await apiClient.acceptChargingRequest(requestId, providerCarId);
      toast({
        title: "Request Accepted",
        description: "You have accepted the charging request.",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Accept Failed",
        description: error.message || "Failed to accept request",
        variant: "destructive",
      });
    }
  };

  const handleStartCharging = async (requestId: string) => {
    try {
      await apiClient.startCharging(requestId);
      toast({
        title: "Charging Started",
        description: "Energy transfer has begun.",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Start Failed",
        description: error.message || "Failed to start charging",
        variant: "destructive",
      });
    }
  };

  const handleCompleteCharging = async (requestId: string) => {
    try {
      await apiClient.completeCharging(requestId);
      toast({
        title: "Charging Complete",
        description: "Transaction has been completed.",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Complete Failed",
        description: error.message || "Failed to complete charging",
        variant: "destructive",
      });
    }
  };

  const earnings = activeTransactions.reduce((sum, tx) => sum + (tx.total_price || 0), 0);
  const energySold = activeTransactions.reduce((sum, tx) => sum + tx.requested_energy_kwh, 0);

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
                <h1 className="text-2xl font-bold">Provider Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your energy offerings</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Earnings</span>
              <DollarSign className="h-5 w-5 text-secondary" />
            </div>
            <div className="text-3xl font-bold text-secondary">${earnings.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">From active transactions</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Energy Sold</span>
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold">{energySold.toFixed(1)} kWh</div>
            <div className="text-xs text-muted-foreground mt-1">Current period</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">My Cars</span>
              <Battery className="h-5 w-5 text-energy-high" />
            </div>
            <div className="text-3xl font-bold">{cars.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Registered vehicles</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">New Requests</span>
              <TrendingUp className="h-5 w-5 text-status-requested" />
            </div>
            <div className="text-3xl font-bold">{requests.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Pending your response</div>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">
              <AlertCircle className="mr-2 h-4 w-4" />
              Requests ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              <Clock className="mr-2 h-4 w-4" />
              Active ({activeTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="stations">
              <Battery className="mr-2 h-4 w-4" />
              My Cars ({cars.length})
            </TabsTrigger>
          </TabsList>

          {/* Incoming Requests */}
          <TabsContent value="requests" className="space-y-4">
            {requests.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Pending Requests</h3>
                <p className="text-muted-foreground">
                  New energy requests will appear here
                </p>
              </Card>
            ) : (
              requests.map((request) => (
                <Card key={request.request_id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{request.request_id}</h3>
                      <p className="text-sm text-muted-foreground">Consumer: {request.consumer_car_id}</p>
                    </div>
                    <Badge className="bg-status-requested">New Request</Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Energy Needed</div>
                      <div className="font-semibold">{request.requested_energy_kwh} kWh</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Price/kWh</div>
                      <div className="font-semibold">${request.price_per_kwh}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Location</div>
                      <div className="font-semibold text-xs">{request.location.lat.toFixed(2)}, {request.location.lon.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Total</div>
                      <div className="font-semibold text-secondary">
                        ${(request.requested_energy_kwh * request.price_per_kwh).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {cars.length > 0 ? (
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 gradient-primary" 
                        onClick={() => handleAcceptRequest(request.request_id, cars[0].car_id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept with {cars[0].car_type}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-sm text-muted-foreground">
                      Register a car to accept requests
                    </div>
                  )}
                </Card>
              ))
            )}
          </TabsContent>

          {/* Active Transactions */}
          <TabsContent value="active" className="space-y-4">
            {activeTransactions.length === 0 ? (
              <Card className="p-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Transactions</h3>
                <p className="text-muted-foreground">
                  Accepted requests will appear here
                </p>
              </Card>
            ) : (
              activeTransactions.map((tx) => (
                <Card key={tx.request_id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{tx.request_id}</h3>
                      <p className="text-sm text-muted-foreground">Consumer: {tx.consumer_car_id}</p>
                    </div>
                    <Badge className={tx.status === "accepted" ? "bg-status-accepted" : "bg-status-progress"}>
                      {tx.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Energy</div>
                      <div className="font-semibold">{tx.requested_energy_kwh} kWh</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Price/kWh</div>
                      <div className="font-semibold">${tx.price_per_kwh}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Total</div>
                      <div className="font-semibold text-secondary">
                        ${(tx.requested_energy_kwh * tx.price_per_kwh).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {tx.status === "accepted" && (
                      <Button onClick={() => handleStartCharging(tx.request_id)} className="flex-1">
                        Start Charging
                      </Button>
                    )}
                    {tx.status === "in_progress" && (
                      <Button onClick={() => handleCompleteCharging(tx.request_id)} className="flex-1 gradient-primary">
                        Complete Transaction
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* My Stations */}
          <TabsContent value="stations" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowRegisterCar(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Register New Car
              </Button>
            </div>

            {cars.length === 0 ? (
              <Card className="p-12 text-center">
                <Battery className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Cars Registered</h3>
                <p className="text-muted-foreground mb-6">
                  Register a vehicle to start providing energy
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
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{car.car_type}</h3>
                      <p className="text-sm text-muted-foreground">{car.car_id}</p>
                    </div>
                    <Badge variant="default">Available</Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Battery Level</div>
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

      <RegisterCarDialog
        open={showRegisterCar}
        onOpenChange={setShowRegisterCar}
        userId={userId}
        onSuccess={loadData}
      />
    </div>
  );
};

export default ProviderDashboard;
