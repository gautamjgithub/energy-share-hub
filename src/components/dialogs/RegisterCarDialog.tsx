import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface RegisterCarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSuccess?: () => void;
}

const RegisterCarDialog = ({ open, onOpenChange, userId, onSuccess }: RegisterCarDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    car_id: "",
    car_type: "",
    battery_capacity_kwh: 0,
    current_soc_percent: 0,
    max_output_kw: 0,
    max_input_kw: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.registerCar({
        ...formData,
        user_id: userId,
      });
      toast({
        title: "Car Registered",
        description: `${formData.car_type} has been added successfully.`,
      });
      onSuccess?.();
      onOpenChange(false);
      setFormData({
        car_id: "",
        car_type: "",
        battery_capacity_kwh: 0,
        current_soc_percent: 0,
        max_output_kw: 0,
        max_input_kw: 0,
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register car. Please try again.",
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
          <DialogTitle>Register New Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="car_id">Vehicle ID</Label>
            <Input
              id="car_id"
              value={formData.car_id}
              onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
              placeholder="CAR-001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="car_type">Vehicle Type</Label>
            <Input
              id="car_type"
              value={formData.car_type}
              onChange={(e) => setFormData({ ...formData, car_type: e.target.value })}
              placeholder="Tesla Model 3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="battery_capacity">Battery Capacity (kWh)</Label>
              <Input
                id="battery_capacity"
                type="number"
                step="0.1"
                value={formData.battery_capacity_kwh}
                onChange={(e) => setFormData({ ...formData, battery_capacity_kwh: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_soc">Current SOC (%)</Label>
              <Input
                id="current_soc"
                type="number"
                min="0"
                max="100"
                value={formData.current_soc_percent}
                onChange={(e) => setFormData({ ...formData, current_soc_percent: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_output">Max Output (kW)</Label>
              <Input
                id="max_output"
                type="number"
                step="0.1"
                value={formData.max_output_kw}
                onChange={(e) => setFormData({ ...formData, max_output_kw: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_input">Max Input (kW)</Label>
              <Input
                id="max_input"
                type="number"
                step="0.1"
                value={formData.max_input_kw}
                onChange={(e) => setFormData({ ...formData, max_input_kw: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gradient-primary" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Vehicle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterCarDialog;
