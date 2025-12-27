import { useState } from 'react';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { EquipmentCategory } from '@/types/maintenance';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Cog, Truck, Monitor, Package } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const categories: { value: EquipmentCategory; label: string; icon: React.ElementType }[] = [
  { value: 'machine', label: 'Machine', icon: Cog },
  { value: 'vehicle', label: 'Vehicle', icon: Truck },
  { value: 'computer', label: 'Computer', icon: Monitor },
  { value: 'other', label: 'Other', icon: Package },
];

export function CreateEquipmentDialog() {
  const { teams, departments, addEquipment } = useMaintenance();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    category: 'machine' as EquipmentCategory,
    department: '',
    assignedTo: '',
    location: '',
    purchaseDate: '',
    warrantyExpiry: '',
    maintenanceTeamId: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.serialNumber || !formData.department || !formData.location || !formData.maintenanceTeamId) {
      toast.error('Please fill in all required fields');
      return;
    }

    addEquipment({
      ...formData,
      isActive: true,
      warrantyExpiry: formData.warrantyExpiry || undefined,
      assignedTo: formData.assignedTo || undefined,
      notes: formData.notes || undefined,
    });

    toast.success('Equipment added successfully');
    setOpen(false);
    setFormData({
      name: '',
      serialNumber: '',
      category: 'machine',
      department: '',
      assignedTo: '',
      location: '',
      purchaseDate: '',
      warrantyExpiry: '',
      maintenanceTeamId: '',
      notes: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Equipment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all',
                    formData.category === cat.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/50'
                  )}
                >
                  <cat.icon className={cn(
                    'h-5 w-5',
                    formData.category === cat.value ? 'text-primary' : 'text-muted-foreground'
                  )} />
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name *</Label>
              <Input
                id="name"
                placeholder="e.g., CNC Machine Alpha"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number *</Label>
              <Input
                id="serialNumber"
                placeholder="e.g., CNC-2024-001"
                value={formData.serialNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(v) => setFormData(prev => ({ ...prev, department: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Building A, Floor 1"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
            <Input
              id="assignedTo"
              placeholder="Person name"
              value={formData.assignedTo}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData(prev => ({ ...prev, warrantyExpiry: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team">Maintenance Team *</Label>
            <Select
              value={formData.maintenanceTeamId}
              onValueChange={(v) => setFormData(prev => ({ ...prev, maintenanceTeamId: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select maintenance team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-2 w-2 rounded-full" 
                        style={{ backgroundColor: team.color }}
                      />
                      {team.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional information..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Add Equipment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
