import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MapPin, Zap, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateRequestDialog = ({ open, onOpenChange }: CreateRequestDialogProps) => {
  const [energyNeeded, setEnergyNeeded] = useState([30]);
  const [maxPrice, setMaxPrice] = useState("0.35");
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
      title: "Request Created",
      description: `Looking for providers to supply ${energyNeeded[0]} kWh at $${maxPrice}/kWh`,
    });
    onOpenChange(false);
  };

  const estimatedCost = (energyNeeded[0] * parseFloat(maxPrice || "0")).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Energy Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Energy Needed (kWh)</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={energyNeeded}
                onValueChange={setEnergyNeeded}
                max={100}
                min={5}
                step={5}
                className="flex-1"
              />
              <div className="w-16 text-right">
                <span className="text-2xl font-bold text-primary">{energyNeeded[0]}</span>
                <span className="text-sm text-muted-foreground ml-1">kWh</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPrice">Max Price per kWh</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="maxPrice"
                type="number"
                step="0.01"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="pl-9"
                placeholder="0.35"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
                placeholder="Enter your location"
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Energy Needed</span>
              <span className="font-medium">{energyNeeded[0]} kWh</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Max Price/kWh</span>
              <span className="font-medium">${maxPrice}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold">Estimated Cost</span>
                <span className="text-xl font-bold text-secondary">${estimatedCost}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 gradient-primary">
            <Zap className="mr-2 h-4 w-4" />
            Create Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRequestDialog;
