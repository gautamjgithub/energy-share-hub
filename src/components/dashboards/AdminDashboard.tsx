import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Activity, Users, Zap, 
  Shield, AlertTriangle, TrendingUp, Database, Loader2 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient, ChargingRequest } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const [requests, setRequests] = useState<ChargingRequest[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allRequests, allPayments] = await Promise.all([
        apiClient.getAllChargingRequests(),
        apiClient.getAllPayments(),
      ]);
      
      setRequests(allRequests);
      setPayments(allPayments);
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

  const networkStats = {
    totalTransactions: requests.length,
    activeTransactions: requests.filter(r => r.status === "in_progress").length,
    completedTransactions: requests.filter(r => r.status === "completed").length,
    totalEnergyTraded: requests.reduce((sum, r) => sum + r.requested_energy_kwh, 0),
    totalValue: requests.reduce((sum, r) => sum + (r.requested_energy_kwh * r.price_per_kwh), 0),
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
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Marketplace Oversight & Control</p>
              </div>
            </div>
            <Badge className="gradient-primary px-4 py-2">
              <Shield className="mr-2 h-4 w-4" />
              Org3: Marketplace Admin
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Network Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Txns</span>
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold">{networkStats.totalTransactions}</div>
            <div className="text-xs text-muted-foreground mt-1">All time</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active</span>
              <Activity className="h-5 w-5 text-status-progress" />
            </div>
            <div className="text-3xl font-bold">{networkStats.activeTransactions}</div>
            <div className="text-xs text-muted-foreground mt-1">In progress now</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Completed</span>
              <Shield className="h-5 w-5 text-status-completed" />
            </div>
            <div className="text-3xl font-bold">{networkStats.completedTransactions}</div>
            <div className="text-xs text-muted-foreground mt-1">Successfully finished</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Energy Traded</span>
              <Zap className="h-5 w-5 text-secondary" />
            </div>
            <div className="text-3xl font-bold">{networkStats.totalEnergyTraded.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground mt-1">Total kWh</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <TrendingUp className="h-5 w-5 text-energy-high" />
            </div>
            <div className="text-3xl font-bold">${networkStats.totalValue.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground mt-1">Transaction volume</div>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">
              <Activity className="mr-2 h-4 w-4" />
              All Transactions ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="payments">
              <Database className="mr-2 h-4 w-4" />
              Payments ({payments.length})
            </TabsTrigger>
            <TabsTrigger value="blockchain">
              <Database className="mr-2 h-4 w-4" />
              Blockchain
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            {requests.length === 0 ? (
              <Card className="p-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Transactions</h3>
                <p className="text-muted-foreground">
                  Transaction history will appear here
                </p>
              </Card>
            ) : (
              requests.map((tx) => (
                <Card key={tx.request_id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{tx.request_id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tx.requested_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge 
                      className={
                        tx.status === "completed" 
                          ? "bg-status-completed" 
                          : tx.status === "in_progress"
                          ? "bg-status-progress"
                          : "bg-status-requested"
                      }
                    >
                      {tx.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Consumer</div>
                      <div className="font-medium text-sm">{tx.consumer_car_id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Provider</div>
                      <div className="font-medium text-sm">{tx.provider_car_id || "Pending"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Energy</div>
                      <div className="font-semibold">{tx.requested_energy_kwh} kWh</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Value</div>
                      <div className="font-semibold text-secondary">
                        ${(tx.requested_energy_kwh * tx.price_per_kwh).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Location</div>
                      <div className="font-mono text-xs">
                        {tx.location.lat.toFixed(2)}, {tx.location.lon.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            {payments.length === 0 ? (
              <Card className="p-12 text-center">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Payments</h3>
                <p className="text-muted-foreground">
                  Payment records will appear here
                </p>
              </Card>
            ) : (
              payments.map((payment, idx) => (
                <Card key={idx} className="p-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">TX Hash</div>
                      <div className="font-mono text-sm">{payment.tx_hash || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Token</div>
                      <div className="font-semibold">{payment.token || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Amount</div>
                      <div className="font-semibold text-secondary">${payment.amount || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Status</div>
                      <Badge>Completed</Badge>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Blockchain Tab */}
          <TabsContent value="blockchain">
            <Card className="p-8">
              <div className="text-center mb-6">
                <Database className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Hyperledger Fabric Network</h3>
                <p className="text-muted-foreground">
                  Blockchain integrity monitoring and audit trail
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {networkStats.totalTransactions}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Transactions</div>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <div className="text-3xl font-bold text-secondary mb-2">3</div>
                  <div className="text-sm text-muted-foreground">Network Organizations</div>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <div className="text-3xl font-bold text-energy-high mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Network Uptime</div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button className="flex-1 gradient-primary" onClick={loadData}>
                  Refresh Data
                </Button>
                <Button variant="outline" className="flex-1">Export Audit Log</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
