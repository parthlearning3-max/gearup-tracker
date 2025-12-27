import { useState } from 'react';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { TeamCard } from '@/components/teams/TeamCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Users } from 'lucide-react';
import { toast } from 'sonner';

const teamColors = [
  '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'
];

export default function TeamsPage() {
  const { teams, addTeam, addTeamMember } = useMaintenance();
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  
  const [newTeam, setNewTeam] = useState({ name: '', description: '', color: teamColors[0] });
  const [newMember, setNewMember] = useState({ 
    name: '', 
    email: '', 
    teamId: '', 
    role: 'technician' as 'technician' | 'manager' 
  });

  const handleCreateTeam = () => {
    if (!newTeam.name) {
      toast.error('Please enter a team name');
      return;
    }
    addTeam(newTeam);
    toast.success('Team created successfully');
    setOpenTeamDialog(false);
    setNewTeam({ name: '', description: '', color: teamColors[0] });
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.teamId) {
      toast.error('Please fill in all required fields');
      return;
    }
    addTeamMember(newMember);
    toast.success('Team member added successfully');
    setOpenMemberDialog(false);
    setNewMember({ name: '', email: '', teamId: '', role: 'technician' });
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Maintenance Teams</h1>
            <p className="text-muted-foreground mt-1">
              Manage teams and assign technicians to maintenance work
            </p>
          </div>
          <div className="flex gap-2">
            {/* Add Member Dialog */}
            <Dialog open={openMemberDialog} onOpenChange={setOpenMemberDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Add Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="memberName">Name *</Label>
                    <Input
                      id="memberName"
                      placeholder="Enter name"
                      value={newMember.name}
                      onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memberEmail">Email *</Label>
                    <Input
                      id="memberEmail"
                      type="email"
                      placeholder="Enter email"
                      value={newMember.email}
                      onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memberTeam">Team *</Label>
                    <Select
                      value={newMember.teamId}
                      onValueChange={(v) => setNewMember(prev => ({ ...prev, teamId: v }))}
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
                  <div className="space-y-2">
                    <Label htmlFor="memberRole">Role</Label>
                    <Select
                      value={newMember.role}
                      onValueChange={(v: 'technician' | 'manager') => 
                        setNewMember(prev => ({ ...prev, role: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technician">Technician</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setOpenMemberDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMember}>Add Member</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Create Team Dialog */}
            <Dialog open={openTeamDialog} onOpenChange={setOpenTeamDialog}>
              <DialogTrigger asChild>
                <Button variant="gradient" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Create New Team</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Name *</Label>
                    <Input
                      id="teamName"
                      placeholder="e.g., Electricians"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamDesc">Description</Label>
                    <Input
                      id="teamDesc"
                      placeholder="What does this team handle?"
                      value={newTeam.description}
                      onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Team Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {teamColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewTeam(prev => ({ ...prev, color }))}
                          className={`h-8 w-8 rounded-full transition-all ${
                            newTeam.color === color 
                              ? 'ring-2 ring-offset-2 ring-primary scale-110' 
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setOpenTeamDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="gradient" onClick={handleCreateTeam}>Create Team</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>

        {teams.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-display font-semibold text-foreground mb-2">No teams yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first maintenance team to get started
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
