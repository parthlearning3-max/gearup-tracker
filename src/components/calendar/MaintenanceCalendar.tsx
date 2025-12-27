import { useState, useMemo } from 'react';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Plus
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday
} from 'date-fns';
import { CreateRequestDialog } from '@/components/requests/CreateRequestDialog';

export function MaintenanceCalendar() {
  const { requests, getEquipmentById } = useMaintenance();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get preventive maintenance requests with scheduled dates
  const scheduledRequests = useMemo(() => 
    requests.filter(r => r.type === 'preventive' && r.scheduledDate),
    [requests]
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getRequestsForDay = (day: Date) => 
    scheduledRequests.filter(r => 
      r.scheduledDate && isSameDay(new Date(r.scheduledDate), day)
    );

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-display text-xl font-semibold text-foreground min-w-[200px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <CreateRequestDialog />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {weekDays.map((day) => (
            <div 
              key={day} 
              className="py-3 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dayRequests = getRequestsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const today = isToday(day);

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'min-h-[120px] border-b border-r p-2 transition-colors cursor-pointer',
                  !isCurrentMonth && 'bg-muted/20 text-muted-foreground',
                  isSelected && 'bg-primary/5 ring-2 ring-inset ring-primary',
                  'hover:bg-accent/50'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                    today && 'bg-primary text-primary-foreground',
                    !today && isCurrentMonth && 'text-foreground',
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayRequests.length > 0 && (
                    <Badge variant="new" className="text-[10px] px-1.5">
                      {dayRequests.length}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayRequests.slice(0, 3).map((request) => {
                    const equipment = getEquipmentById(request.equipmentId);
                    return (
                      <div
                        key={request.id}
                        className={cn(
                          'text-[10px] p-1.5 rounded truncate',
                          request.status === 'new' && 'bg-status-new/10 text-status-new',
                          request.status === 'in_progress' && 'bg-status-progress/10 text-status-progress',
                          request.status === 'repaired' && 'bg-status-complete/10 text-status-complete',
                        )}
                      >
                        {equipment?.name || request.subject}
                      </div>
                    );
                  })}
                  {dayRequests.length > 3 && (
                    <p className="text-[10px] text-muted-foreground text-center">
                      +{dayRequests.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDate && (
        <div className="rounded-xl border bg-card p-4 shadow-soft animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          
          {getRequestsForDay(selectedDate).length > 0 ? (
            <div className="space-y-2">
              {getRequestsForDay(selectedDate).map((request) => {
                const equipment = getEquipmentById(request.equipmentId);
                return (
                  <div 
                    key={request.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{request.subject}</p>
                      <p className="text-xs text-muted-foreground">{equipment?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={request.status === 'new' ? 'new' : 'progress'}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                      {request.scheduledDate && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(request.scheduledDate), 'HH:mm')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CalendarIcon className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No scheduled maintenance for this day</p>
              <Button variant="link" size="sm" className="mt-2">
                <Plus className="h-4 w-4 mr-1" />
                Schedule maintenance
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
