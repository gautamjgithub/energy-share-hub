import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Plus, Battery, MapPin, Clock, 
  Zap, DollarSign, Car, Star, Activity 
} from "lucide-react";
import CreateRequestDialog from "@/components/dialogs/CreateRequestDialog";
import ProviderMapView from "@/components/maps/ProviderMapView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ConsumerDashboardProps {
  onBack: () => void;
}

const ConsumerDashboard = ({ onBack }: ConsumerDashboardProps) => {
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  
  // Mock data
  const walletBalance = 247.50;
  const activeRequests = [
    {
      id: "REQ-001",
      status: "in_progress",
      provider: "Tesla Model 3",
      energyNeeded: 25,
      currentEnergy: 15,
      pricePerKwh: 0.35,
      estimatedTime: "25 min",
      location: "Downtown Station"
    },
    {
      id: "REQ-002",
      status: "requested",
      energyNeeded: 40,
      pricePerKwh: 0.32,
      location: "Mall Parking",
      nearbyProviders: 5
    }
  ];

  const myCars = [
    { id: 1, name: "My Tesla Model Y", battery: 75, range: 280, status: "active" },
    { id: 2, name: "BMW i4", battery: 45, range: 180, status: "charging" }
  ];

  const recentTransactions = [
    { id: 1, date: "2025-11-27", energy: 35, cost: 12.25, rating: 5 },
    { id: 2, date: "2025-11-26", energy: 20, cost: 7.00, rating: 4 },
    { id: 3, date: "2025-11-25", energy: 50, cost: 17.50, rating: 5 }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "requested": return "bg-status-requested";
      case "accepted": return "bg-status-accepted";
      case "in_progress": return "bg-status-progress";
      case "completed": return "bg-status-completed";
      default: return "bg-muted";
    }
  };

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
              <Button className="gradient-primary" onClick={() => setShowCreateRequest(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">
              <Activity className="mr-2 h-4 w-4" />
              Active Requests
            </TabsTrigger>
            <TabsTrigger value="map">
              <MapPin className="mr-2 h-4 w-4" />
              Provider Map
            </TabsTrigger>
            <TabsTrigger value="cars">
              <Car className="mr-2 h-4 w-4" />
              My Cars
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Active Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            {activeRequests.length === 0 ? (
              <Card className="p-12 text-center">
                <Battery className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Requests</h3>
                <p className="text-muted-foreground mb-6">
                  Create a new request to find nearby energy providers
                </p>
                <Button className="gradient-primary" onClick={() => setShowCreateRequest(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Request
                </Button>
              </Card>
            ) : (
              activeRequests.map((request) => (
                <Card key={request.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{request.id}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {request.location}
                        </span>
                        {request.status === "in_progress" && request.estimatedTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {request.estimatedTime}
                          </span>
                        )}
                      </div>
                    </div>
                    {request.status === "in_progress" && (
                      <Button size="sm">View Details</Button>
                    )}
                  </div>

                  {request.status === "in_progress" ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Provider</span>
                        <span className="font-medium">{request.provider}</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Energy Transfer Progress</span>
                          <span className="font-medium">{request.currentEnergy}/{request.energyNeeded} kWh</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full gradient-energy transition-all"
                            style={{ width: `${(request.currentEnergy / request.energyNeeded) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-sm pt-2">
                        <span className="text-muted-foreground">Total Cost</span>
                        <span className="font-semibold text-lg">
                          ${(request.currentEnergy * request.pricePerKwh).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Energy Needed</div>
                        <div className="font-semibold">{request.energyNeeded} kWh</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Price/kWh</div>
                        <div className="font-semibold">${request.pricePerKwh}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Nearby Providers</div>
                        <div className="font-semibold text-secondary">{request.nearbyProviders}</div>
                      </div>
                    </div>
                  )}
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
            {myCars.map((car) => (
              <Card key={car.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                      <Car className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{car.name}</h3>
                      <Badge variant="outline">{car.status}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Battery</div>
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4 text-energy-high" />
                      <span className="font-semibold">{car.battery}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Range</div>
                    <div className="font-semibold">{car.range} km</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <div className="font-semibold capitalize">{car.status}</div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {recentTransactions.map((tx) => (
              <Card key={tx.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold mb-1">{tx.energy} kWh transferred</div>
                    <div className="text-sm text-muted-foreground">{tx.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg mb-1">${tx.cost.toFixed(2)}</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < tx.rating ? "fill-status-requested text-status-requested" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <CreateRequestDialog 
        open={showCreateRequest} 
        onOpenChange={setShowCreateRequest}
      />
    </div>
  );
};

export default ConsumerDashboard;
