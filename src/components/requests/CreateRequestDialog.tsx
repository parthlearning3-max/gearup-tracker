import { useState } from 'react';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { RequestType } from '@/types/maintenance';
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
import { Plus, Wrench, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CreateRequestDialogProps {
  preselectedEquipmentId?: string;
}

export function CreateRequestDialog({ preselectedEquipmentId }: CreateRequestDialogProps) {
  const { equipment, teams, teamMembers, addRequest, getEquipmentById } = useMaintenance();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    type: 'corrective' as RequestType,
    equipmentId: preselectedEquipmentId || '',
    teamId: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    scheduledDate: '',
  });

  // Auto-fill team when equipment is selected
  const handleEquipmentChange = (equipmentId: string) => {
    const selectedEquipment = getEquipmentById(equipmentId);
    setFormData(prev => ({
      ...prev,
      equipmentId,
      teamId: selectedEquipment?.maintenanceTeamId || '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.equipmentId || !formData.teamId) {
      toast.error('Please fill in all required fields');
      return;
    }

    addRequest({
      subject: formData.subject,
      description: formData.description,
      type: formData.type,
      status: 'new',
      equipmentId: formData.equipmentId,
      teamId: formData.teamId,
      priority: formData.priority,
      createdById: 'user-1', // Mock current user
      scheduledDate: formData.scheduledDate || undefined,
    });

    toast.success('Maintenance request created successfully');
    setOpen(false);
    setFormData({
      subject: '',
      description: '',
      type: 'corrective',
      equipmentId: '',
      teamId: '',
      priority: 'medium',
      scheduledDate: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Create Maintenance Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Request Type */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'corrective' }))}
              className={cn(
                'flex items-center gap-3 rounded-lg border-2 p-4 transition-all',
                formData.type === 'corrective'
                  ? 'border-destructive bg-destructive/5'
                  : 'border-border hover:border-muted-foreground/50'
              )}
            >
              <Wrench className={cn(
                'h-5 w-5',
                formData.type === 'corrective' ? 'text-destructive' : 'text-muted-foreground'
              )} />
              <div className="text-left">
                <p className="font-medium text-sm">Corrective</p>
                <p className="text-xs text-muted-foreground">Breakdown repair</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'preventive' }))}
              className={cn(
                'flex items-center gap-3 rounded-lg border-2 p-4 transition-all',
                formData.type === 'preventive'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/50'
              )}
            >
              <Calendar className={cn(
                'h-5 w-5',
                formData.type === 'preventive' ? 'text-primary' : 'text-muted-foreground'
              )} />
              <div className="text-left">
                <p className="font-medium text-sm">Preventive</p>
                <p className="text-xs text-muted-foreground">Scheduled checkup</p>
              </div>
            </button>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="What is wrong?"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            />
          </div>

          {/* Equipment */}
          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment *</Label>
            <Select
              value={formData.equipmentId}
              onValueChange={handleEquipmentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipment.filter(e => e.isActive).map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name} ({eq.serialNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team (auto-filled) */}
          <div className="space-y-2">
            <Label htmlFor="team">Maintenance Team *</Label>
            <Select
              value={formData.teamId}
              onValueChange={(v) => setFormData(prev => ({ ...prev, teamId: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
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

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(v: 'low' | 'medium' | 'high' | 'urgent') => 
                setFormData(prev => ({ ...prev, priority: v }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scheduled Date (for preventive) */}
          {formData.type === 'preventive' && (
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide additional details..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Create Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
