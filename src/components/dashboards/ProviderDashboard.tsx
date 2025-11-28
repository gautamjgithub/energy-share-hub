import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Battery, TrendingUp, Zap, 
  DollarSign, Clock, CheckCircle, AlertCircle 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProviderDashboardProps {
  onBack: () => void;
}

const ProviderDashboard = ({ onBack }: ProviderDashboardProps) => {
  const earnings = 1847.25;
  const energySold = 2456;
  const activeListings = 3;
  const rating = 4.8;

  const incomingRequests = [
    {
      id: "REQ-105",
      consumer: "Tesla Model Y",
      energy: 30,
      price: 0.35,
      distance: 0.8,
      status: "pending"
    },
    {
      id: "REQ-106", 
      consumer: "Nissan Leaf",
      energy: 20,
      price: 0.32,
      distance: 1.2,
      status: "pending"
    }
  ];

  const activeTransactions = [
    {
      id: "TXN-042",
      consumer: "BMW i4",
      energy: 25,
      current: 18,
      price: 0.34,
      timeRemaining: "12 min"
    }
  ];

  const myStations = [
    {
      id: 1,
      name: "Home Charger",
      type: "Personal Vehicle",
      battery: 85,
      available: 40,
      pricePerKwh: 0.35,
      status: "available"
    },
    {
      id: 2,
      name: "Fast Charging Point",
      type: "Commercial Station",
      battery: 95,
      available: 60,
      pricePerKwh: 0.40,
      status: "in_use"
    }
  ];

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
            <div className="text-xs text-muted-foreground mt-1">+12.5% this month</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Energy Sold</span>
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold">{energySold} kWh</div>
            <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Listings</span>
              <Battery className="h-5 w-5 text-energy-high" />
            </div>
            <div className="text-3xl font-bold">{activeListings}</div>
            <div className="text-xs text-muted-foreground mt-1">Available now</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Provider Rating</span>
              <TrendingUp className="h-5 w-5 text-status-requested" />
            </div>
            <div className="text-3xl font-bold">{rating}</div>
            <div className="text-xs text-muted-foreground mt-1">Based on 47 reviews</div>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">
              <AlertCircle className="mr-2 h-4 w-4" />
              Requests ({incomingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              <Clock className="mr-2 h-4 w-4" />
              Active
            </TabsTrigger>
            <TabsTrigger value="stations">
              <Battery className="mr-2 h-4 w-4" />
              My Stations
            </TabsTrigger>
          </TabsList>

          {/* Incoming Requests */}
          <TabsContent value="requests" className="space-y-4">
            {incomingRequests.map((request) => (
              <Card key={request.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{request.id}</h3>
                    <p className="text-sm text-muted-foreground">From: {request.consumer}</p>
                  </div>
                  <Badge className="bg-status-requested">New Request</Badge>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Energy Needed</div>
                    <div className="font-semibold">{request.energy} kWh</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Price/kWh</div>
                    <div className="font-semibold">${request.price}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Distance</div>
                    <div className="font-semibold">{request.distance} km</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total</div>
                    <div className="font-semibold text-secondary">
                      ${(request.energy * request.price).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 gradient-primary">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept Request
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Negotiate
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Active Transactions */}
          <TabsContent value="active" className="space-y-4">
            {activeTransactions.map((tx) => (
              <Card key={tx.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{tx.id}</h3>
                    <p className="text-sm text-muted-foreground">Consumer: {tx.consumer}</p>
                  </div>
                  <Badge className="bg-status-progress">In Progress</Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Energy Transfer Progress</span>
                      <span className="font-medium">{tx.current}/{tx.energy} kWh</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full gradient-energy transition-all"
                        style={{ width: `${(tx.current / tx.energy) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{tx.timeRemaining} remaining</span>
                    </div>
                    <div className="font-semibold text-lg text-secondary">
                      ${(tx.current * tx.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* My Stations */}
          <TabsContent value="stations" className="space-y-4">
            {myStations.map((station) => (
              <Card key={station.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{station.name}</h3>
                    <p className="text-sm text-muted-foreground">{station.type}</p>
                  </div>
                  <Badge variant={station.status === "available" ? "default" : "outline"}>
                    {station.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Battery Level</div>
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4 text-energy-high" />
                      <span className="font-semibold">{station.battery}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Available</div>
                    <div className="font-semibold">{station.available} kWh</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Price/kWh</div>
                    <div className="font-semibold">${station.pricePerKwh}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <div className="font-semibold capitalize">{station.status}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">Edit Pricing</Button>
                  <Button variant="outline" className="flex-1">View Details</Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderDashboard;
