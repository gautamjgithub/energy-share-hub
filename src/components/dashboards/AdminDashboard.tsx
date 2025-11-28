import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Activity, Users, Zap, 
  Shield, AlertTriangle, TrendingUp, Database 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const networkStats = {
    totalUsers: 1247,
    activeTransactions: 47,
    totalEnergyTraded: 15632,
    blockchainBlocks: 8456,
    successRate: 98.7
  };

  const recentTransactions = [
    {
      id: "TXN-8456",
      consumer: "User-245",
      provider: "User-782",
      energy: 35,
      amount: 12.25,
      status: "completed",
      blockHash: "0x7f3a...4b2c",
      timestamp: "2 min ago"
    },
    {
      id: "TXN-8455",
      consumer: "User-391",
      provider: "Station-12",
      energy: 50,
      amount: 20.00,
      status: "in_progress",
      blockHash: "pending",
      timestamp: "5 min ago"
    },
    {
      id: "TXN-8454",
      consumer: "User-102",
      provider: "User-543",
      energy: 25,
      amount: 8.75,
      status: "completed",
      blockHash: "0x9c2f...7d1a",
      timestamp: "8 min ago"
    }
  ];

  const disputes = [
    {
      id: "DISP-12",
      transaction: "TXN-8401",
      reason: "Energy mismatch",
      status: "investigating",
      priority: "high"
    }
  ];

  const aiAgentActivity = [
    {
      id: 1,
      agent: "AI-Agent-07",
      action: "Auto-accepted request",
      details: "Consumer within 1.5km, price match",
      timestamp: "1 min ago"
    },
    {
      id: 2,
      agent: "AI-Agent-03",
      action: "Created provider listing",
      details: "Surplus energy detected: 45 kWh",
      timestamp: "3 min ago"
    },
    {
      id: 3,
      agent: "AI-Agent-12",
      action: "Negotiated price",
      details: "Adjusted from $0.40 to $0.36/kWh",
      timestamp: "7 min ago"
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
              <span className="text-sm text-muted-foreground">Total Users</span>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold">{networkStats.totalUsers}</div>
            <div className="text-xs text-muted-foreground mt-1">Active network participants</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Txns</span>
              <Activity className="h-5 w-5 text-status-progress" />
            </div>
            <div className="text-3xl font-bold">{networkStats.activeTransactions}</div>
            <div className="text-xs text-muted-foreground mt-1">In real-time</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Energy Traded</span>
              <Zap className="h-5 w-5 text-secondary" />
            </div>
            <div className="text-3xl font-bold">{networkStats.totalEnergyTraded}</div>
            <div className="text-xs text-muted-foreground mt-1">Total kWh</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Blockchain</span>
              <Database className="h-5 w-5 text-accent" />
            </div>
            <div className="text-3xl font-bold">{networkStats.blockchainBlocks}</div>
            <div className="text-xs text-muted-foreground mt-1">Total blocks</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <TrendingUp className="h-5 w-5 text-energy-high" />
            </div>
            <div className="text-3xl font-bold">{networkStats.successRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">Transaction success</div>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">
              <Activity className="mr-2 h-4 w-4" />
              Live Transactions
            </TabsTrigger>
            <TabsTrigger value="disputes">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Disputes ({disputes.length})
            </TabsTrigger>
            <TabsTrigger value="ai-agents">
              <Shield className="mr-2 h-4 w-4" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="blockchain">
              <Database className="mr-2 h-4 w-4" />
              Blockchain
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            {recentTransactions.map((tx) => (
              <Card key={tx.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{tx.id}</h3>
                    <p className="text-sm text-muted-foreground">{tx.timestamp}</p>
                  </div>
                  <Badge 
                    className={
                      tx.status === "completed" 
                        ? "bg-status-completed" 
                        : "bg-status-progress"
                    }
                  >
                    {tx.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Consumer</div>
                    <div className="font-medium text-sm">{tx.consumer}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Provider</div>
                    <div className="font-medium text-sm">{tx.provider}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Energy</div>
                    <div className="font-semibold">{tx.energy} kWh</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Amount</div>
                    <div className="font-semibold text-secondary">${tx.amount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Block Hash</div>
                    <div className="font-mono text-xs">{tx.blockHash}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Audit Log</Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-4">
            {disputes.length === 0 ? (
              <Card className="p-12 text-center">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Disputes</h3>
                <p className="text-muted-foreground">
                  All transactions are proceeding smoothly
                </p>
              </Card>
            ) : (
              disputes.map((dispute) => (
                <Card key={dispute.id} className="p-6 border-destructive/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{dispute.id}</h3>
                      <p className="text-sm text-muted-foreground">Transaction: {dispute.transaction}</p>
                    </div>
                    <Badge variant="destructive">{dispute.priority}</Badge>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Reason</div>
                    <div className="font-medium">{dispute.reason}</div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1">Investigate</Button>
                    <Button variant="outline" className="flex-1">Contact Parties</Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* AI Agents Tab */}
          <TabsContent value="ai-agents" className="space-y-4">
            {aiAgentActivity.map((activity) => (
              <Card key={activity.id} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{activity.agent}</h3>
                      <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                    </div>
                    <div className="text-sm font-medium text-primary mb-1">{activity.action}</div>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                </div>
              </Card>
            ))}
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
                    {networkStats.blockchainBlocks}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Blocks</div>
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
                <Button className="flex-1 gradient-primary">View Chaincode</Button>
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
