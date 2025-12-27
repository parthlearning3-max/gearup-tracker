import { useMaintenance } from '@/contexts/MaintenanceContext';
import { Team } from '@/types/maintenance';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  const { getTeamMembersByTeam, requests } = useMaintenance();
  
  const members = getTeamMembersByTeam(team.id);
  const teamRequests = requests.filter(r => r.teamId === team.id);
  const activeRequests = teamRequests.filter(r => r.status === 'new' || r.status === 'in_progress');

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-elevated animate-fade-in-up">
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: team.color }}
      />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display font-semibold text-foreground">{team.name}</h3>
            {team.description && (
              <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            {members.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Members */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Team Members</p>
          <div className="flex flex-wrap gap-2">
            {members.slice(0, 5).map((member) => (
              <div key={member.id} className="flex items-center gap-2 bg-secondary/50 rounded-full pl-1 pr-3 py-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{member.name}</span>
                {member.role === 'manager' && (
                  <Badge variant="secondary" className="text-[8px] px-1 py-0">MGR</Badge>
                )}
              </div>
            ))}
            {members.length > 5 && (
              <div className="flex items-center justify-center h-8 px-3 bg-secondary/50 rounded-full">
                <span className="text-xs text-muted-foreground">+{members.length - 5} more</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <p className="font-display text-xl font-bold text-foreground">{activeRequests.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Active Requests</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <p className="font-display text-xl font-bold text-foreground">
              {teamRequests.filter(r => r.status === 'repaired').length}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase">Completed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
