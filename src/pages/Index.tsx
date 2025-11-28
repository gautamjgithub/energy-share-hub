import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Car, Battery, Network, Shield, TrendingUp } from "lucide-react";
import ConsumerDashboard from "@/components/dashboards/ConsumerDashboard";
import ProviderDashboard from "@/components/dashboards/ProviderDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";

type UserRole = "consumer" | "provider" | "admin" | null;

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);

  if (userRole === "consumer") {
    return <ConsumerDashboard onBack={() => setUserRole(null)} />;
  }

  if (userRole === "provider") {
    return <ProviderDashboard onBack={() => setUserRole(null)} />;
  }

  if (userRole === "admin") {
    return <AdminDashboard onBack={() => setUserRole(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by Hyperledger Fabric</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                HUM-X
              </span>
              <br />
              <span className="text-foreground">Energy Marketplace</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Peer-to-peer energy trading for electric vehicles. Share energy, earn rewards, 
              and power the future of sustainable transportation.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="gradient-primary shadow-glow hover:scale-105 transition-transform"
                onClick={() => setUserRole("consumer")}
              >
                <Car className="mr-2 h-5 w-5" />
                Join as Consumer
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
                onClick={() => setUserRole("provider")}
              >
                <Battery className="mr-2 h-5 w-5" />
                Join as Provider
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How HUM-X Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Blockchain-powered energy trading with AI-driven matching
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow border-primary/10">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <Network className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">V2V Energy Transfer</h3>
              <p className="text-muted-foreground">
                Vehicle-to-vehicle charging enables direct energy sharing between EVs. 
                Perfect for emergencies or topping up on the go.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow border-primary/10">
              <div className="w-12 h-12 rounded-lg gradient-energy flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Blockchain Security</h3>
              <p className="text-muted-foreground">
                Every transaction is recorded on Hyperledger Fabric, ensuring trust, 
                transparency, and immutable audit trails.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow border-primary/10">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Auto-Matching</h3>
              <p className="text-muted-foreground">
                Our AI agents automatically match requests based on proximity, 
                price preferences, and availability.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Network Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Three-Organization Network
              </h2>
              <p className="text-muted-foreground text-lg">
                A decentralized marketplace powered by three key networks
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center hover:shadow-lg transition-all hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-status-requested/20 flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-status-requested" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Org1: Consumers</h3>
                <p className="text-muted-foreground text-sm">
                  EV owners requesting energy. Manage multiple vehicles, 
                  discover nearby providers, and complete secure transactions.
                </p>
                <Button 
                  className="mt-6 w-full"
                  variant="outline"
                  onClick={() => setUserRole("consumer")}
                >
                  View Consumer Portal
                </Button>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-all hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Battery className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Org2: Providers</h3>
                <p className="text-muted-foreground text-sm">
                  EV owners and charging stations selling energy. 
                  Set your prices, manage availability, and earn from surplus power.
                </p>
                <Button 
                  className="mt-6 w-full"
                  variant="outline"
                  onClick={() => setUserRole("provider")}
                >
                  View Provider Portal
                </Button>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-all hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Org3: Marketplace</h3>
                <p className="text-muted-foreground text-sm">
                  Network orchestration and oversight. Monitor transactions, 
                  resolve disputes, and maintain blockchain integrity.
                </p>
                <Button 
                  className="mt-6 w-full"
                  variant="outline"
                  onClick={() => setUserRole("admin")}
                >
                  View Admin Portal
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,247</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">15,632</div>
              <div className="text-muted-foreground">Transactions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">98.7%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-energy-high mb-2">847 kWh</div>
              <div className="text-muted-foreground">Energy Traded</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-semibold">HUM-X Energy Marketplace</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by Hyperledger Fabric • Sustainable Energy Trading
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
