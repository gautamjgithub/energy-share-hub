import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Battery, DollarSign, Navigation } from "lucide-react";

const ProviderMapView = () => {
  const providers = [
    {
      id: 1,
      name: "Tesla Model 3",
      type: "Personal Vehicle",
      distance: 0.8,
      available: 40,
      price: 0.35,
      rating: 4.9,
      lat: 37.7749,
      lng: -122.4194
    },
    {
      id: 2,
      name: "Fast Charging Station A",
      type: "Commercial Station",
      distance: 1.2,
      available: 80,
      price: 0.40,
      rating: 4.7,
      lat: 37.7849,
      lng: -122.4094
    },
    {
      id: 3,
      name: "BMW i4",
      type: "Personal Vehicle",
      distance: 2.1,
      available: 25,
      price: 0.32,
      rating: 5.0,
      lat: 37.7649,
      lng: -122.4294
    }
  ];

  return (
    <div className="space-y-6">
      {/* Map Placeholder */}
      <Card className="h-96 relative overflow-hidden bg-muted/30">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="h-16 w-16 text-primary mx-auto animate-pulse-slow" />
            <p className="text-muted-foreground">Interactive map view</p>
            <p className="text-sm text-muted-foreground">
              Shows real-time provider locations near you
            </p>
          </div>
        </div>

        {/* Mock location markers */}
        <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-secondary border-4 border-background shadow-lg animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full bg-primary border-4 border-background shadow-lg animate-pulse-slow" />
        <div className="absolute top-2/3 left-2/3 w-8 h-8 rounded-full bg-accent border-4 border-background shadow-lg animate-pulse-slow" />
      </Card>

      {/* Provider List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Nearby Providers</h3>
          <Badge variant="outline">{providers.length} available</Badge>
        </div>

        <div className="space-y-3">
          {providers.map((provider) => (
            <Card key={provider.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{provider.name}</h4>
                    <Badge variant="outline" className="text-xs">{provider.type}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Navigation className="h-3 w-3" />
                      <span>{provider.distance} km</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Battery className="h-3 w-3" />
                      <span>{provider.available} kWh</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>₹{provider.price}/kWh</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-status-requested">★</span>
                      <span className="font-medium">{provider.rating}</span>
                    </div>
                  </div>
                </div>

                <Button size="sm" className="gradient-primary">
                  Request
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderMapView;
