import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

interface TrainAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  userId: string;
  userRole: "consumer" | "provider";
}

const TIME_SLOTS = [
  { id: "6am-9am", label: "6am-9am" },
  { id: "9am-12pm", label: "9am-12pm" },
  { id: "12pm-3pm", label: "12pm-3pm" },
  { id: "3pm-6pm", label: "3pm-6pm" },
  { id: "6pm-9pm", label: "6pm-9pm" },
  { id: "9pm-12am", label: "9pm-12am" },
];

const TrainAgentDialog = ({ open, onOpenChange, onSuccess, userId, userRole }: TrainAgentDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    pincode: "",
    pricePerKwh: "",
    preferredSlots: [] as string[],
    vehicleModel: "",
    batteryPercentage: "",
  });

  const handleSlotToggle = (slotId: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredSlots: prev.preferredSlots.includes(slotId)
        ? prev.preferredSlots.filter((id) => id !== slotId)
        : [...prev.preferredSlots, slotId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Send this data to your API endpoint for storing preferences
      console.log(`${userRole} training data:`, { userId, ...formData });
      
      toast({
        title: "Agent Training Complete",
        description: "Your preferences have been saved successfully.",
      });
      
      onSuccess?.();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        location: "",
        pincode: "",
        pricePerKwh: "",
        preferredSlots: [],
        vehicleModel: "",
        batteryPercentage: "",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Save",
        description: error.message || "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <Button
            variant="ghost"
            className="w-fit -ml-2 mb-2"
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Button>
          <DialogTitle className="text-2xl">Train your Agent</DialogTitle>
          <p className="text-muted-foreground">
            {userRole === "consumer" 
              ? "Consumers — provide your car model and current battery percentage so the agent can make decisions for you."
              : "Providers — provide location, pincode and preferred availability slots."}
            {userRole === "provider" && (
              <>
                <br />
                <span className="text-sm">(Vehicle info is optional and is not required.)</span>
              </>
            )}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {userRole === "consumer" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Vehicle Model</Label>
                <Input
                  id="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  placeholder="e.g. Tesla Model 3"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batteryPercentage">Battery percentage (%)</Label>
                <Input
                  id="batteryPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.batteryPercentage}
                  onChange={(e) => setFormData({ ...formData, batteryPercentage: e.target.value })}
                  placeholder="Enter current battery percentage"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="location">Location / Address</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter your location"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="Enter pincode"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per kWh (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.pricePerKwh}
                  onChange={(e) => setFormData({ ...formData, pricePerKwh: e.target.value })}
                  placeholder="Enter price"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Preferred slot timings (choose one or more)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <div key={slot.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={slot.id}
                        checked={formData.preferredSlots.includes(slot.id)}
                        onCheckedChange={() => handleSlotToggle(slot.id)}
                      />
                      <Label htmlFor={slot.id} className="font-normal cursor-pointer">
                        {slot.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Train Agent
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainAgentDialog;
