import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface KanbanColumnProps {
  title: string;
  count: number;
  variant: 'new' | 'progress' | 'complete' | 'scrap';
  children: ReactNode;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  isDropTarget?: boolean;
}

const columnStyles = {
  new: {
    header: 'bg-status-new/10 border-status-new/20',
    badge: 'new' as const,
  },
  progress: {
    header: 'bg-status-progress/10 border-status-progress/20',
    badge: 'progress' as const,
  },
  complete: {
    header: 'bg-status-complete/10 border-status-complete/20',
    badge: 'complete' as const,
  },
  scrap: {
    header: 'bg-status-scrap/10 border-status-scrap/20',
    badge: 'scrap' as const,
  },
};

export function KanbanColumn({ 
  title, 
  count, 
  variant, 
  children, 
  onDrop, 
  onDragOver,
  isDropTarget 
}: KanbanColumnProps) {
  const styles = columnStyles[variant];

  return (
    <div 
      className={cn(
        'flex flex-col rounded-xl bg-muted/30 border transition-all duration-200 min-w-[300px]',
        isDropTarget && 'ring-2 ring-primary ring-offset-2 bg-primary/5'
      )}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className={cn(
        'flex items-center justify-between rounded-t-xl border-b px-4 py-3',
        styles.header
      )}>
        <h3 className="font-display font-semibold text-foreground">{title}</h3>
        <Badge variant={styles.badge} className="text-xs">
          {count}
        </Badge>
      </div>
      <div className="flex-1 space-y-3 p-3 min-h-[400px] max-h-[calc(100vh-280px)] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
