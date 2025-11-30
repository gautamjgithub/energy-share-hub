import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface RegisterUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (userId: string) => void;
}

const RegisterUserDialog = ({ open, onOpenChange, onSuccess }: RegisterUserDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "consumer" as "consumer" | "provider" | "admin",
    wallet_address: "",
    provider_type: "rent_car_charging_point" as "rent_car_charging_point" | "charging_station_owner",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = {
        ...formData,
        metadata: formData.role === "provider" ? { provider_type: formData.provider_type } : undefined,
      };
      const result = await apiClient.registerUser(userData);
      toast({
        title: "Registration Successful",
        description: `User ${formData.username} has been registered successfully.`,
      });
      onSuccess?.(formData.username);
      onOpenChange(false);
      setFormData({
        username: "",
        email: "",
        role: "consumer",
        wallet_address: "",
        provider_type: "rent_car_charging_point",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "consumer" | "provider" | "admin") =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consumer">Consumer</SelectItem>
                <SelectItem value="provider">Provider</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.role === "provider" && (
            <div className="space-y-3">
              <Label>Provider Type</Label>
              <RadioGroup
                value={formData.provider_type}
                onValueChange={(value: "rent_car_charging_point" | "charging_station_owner") =>
                  setFormData({ ...formData, provider_type: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rent_car_charging_point" id="rent" />
                  <Label htmlFor="rent" className="font-normal cursor-pointer">
                    Rent my own car charging point
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="charging_station_owner" id="station" />
                  <Label htmlFor="station" className="font-normal cursor-pointer">
                    Charging station owner
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input
              id="wallet"
              value={formData.wallet_address}
              onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
              placeholder="0x..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gradient-primary" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterUserDialog;
