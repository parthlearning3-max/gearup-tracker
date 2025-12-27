import { useMaintenance } from '@/contexts/MaintenanceContext';
import { MaintenanceRequest } from '@/types/maintenance';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle, Calendar, Wrench } from 'lucide-react';
import { format } from 'date-fns';

interface RequestCardProps {
  request: MaintenanceRequest;
  isDragging?: boolean;
}

export function RequestCard({ request, isDragging }: RequestCardProps) {
  const { getEquipmentById, getTeamById, getTeamMemberById } = useMaintenance();
  
  const equipment = getEquipmentById(request.equipmentId);
  const team = getTeamById(request.teamId);
  const assignee = request.assignedToId ? getTeamMemberById(request.assignedToId) : null;

  const priorityVariant = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    urgent: 'urgent',
  } as const;

  return (
    <div
      className={cn(
        'group relative rounded-lg border bg-card p-4 shadow-soft transition-all duration-200',
        'hover:shadow-card hover:border-primary/20 cursor-grab active:cursor-grabbing',
        isDragging && 'shadow-elevated rotate-2 scale-105 opacity-90',
        request.isOverdue && 'border-l-4 border-l-destructive'
      )}
    >
      {request.isOverdue && (
        <div className="absolute -top-2 -right-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground animate-pulse-soft">
            <AlertTriangle className="h-3 w-3" />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm text-foreground leading-tight line-clamp-2">
            {request.subject}
          </h4>
          <Badge variant={priorityVariant[request.priority]} className="shrink-0 text-[10px]">
            {request.priority}
          </Badge>
        </div>

        {/* Equipment */}
        {equipment && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Wrench className="h-3 w-3" />
            <span className="truncate">{equipment.name}</span>
          </div>
        )}

        {/* Type Badge */}
        <Badge variant={request.type === 'corrective' ? 'corrective' : 'preventive'} className="text-[10px]">
          {request.type}
        </Badge>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {request.scheduledDate ? (
              <>
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(request.scheduledDate), 'MMM d')}</span>
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" />
                <span>{format(new Date(request.createdAt), 'MMM d')}</span>
              </>
            )}
          </div>

          {assignee ? (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {assignee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-6 w-6 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground">?</span>
            </div>
          )}
        </div>

        {/* Team indicator */}
        {team && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg transition-opacity opacity-50 group-hover:opacity-100"
            style={{ backgroundColor: team.color }}
          />
        )}
      </div>
    </div>
  );
}
