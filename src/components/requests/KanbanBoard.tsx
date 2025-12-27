import { useState } from 'react';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { MaintenanceRequest, RequestStatus } from '@/types/maintenance';
import { KanbanColumn } from './KanbanColumn';
import { RequestCard } from './RequestCard';

const columns: { status: RequestStatus; title: string; variant: 'new' | 'progress' | 'complete' | 'scrap' }[] = [
  { status: 'new', title: 'New', variant: 'new' },
  { status: 'in_progress', title: 'In Progress', variant: 'progress' },
  { status: 'repaired', title: 'Repaired', variant: 'complete' },
  { status: 'scrap', title: 'Scrap', variant: 'scrap' },
];

export function KanbanBoard() {
  const { requests, updateRequestStatus } = useMaintenance();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<RequestStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, requestId: string) => {
    e.dataTransfer.setData('requestId', requestId);
    setDraggingId(requestId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, status: RequestStatus) => {
    e.preventDefault();
    const requestId = e.dataTransfer.getData('requestId');
    if (requestId) {
      updateRequestStatus(requestId, status);
    }
    setDropTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, status: RequestStatus) => {
    e.preventDefault();
    setDropTarget(status);
  };

  const getRequestsByStatus = (status: RequestStatus) => 
    requests.filter(r => r.status === status);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnRequests = getRequestsByStatus(column.status);
        return (
          <KanbanColumn
            key={column.status}
            title={column.title}
            count={columnRequests.length}
            variant={column.variant}
            onDrop={(e) => handleDrop(e, column.status)}
            onDragOver={(e) => handleDragOver(e, column.status)}
            isDropTarget={dropTarget === column.status}
          >
            {columnRequests.map((request) => (
              <div
                key={request.id}
                draggable
                onDragStart={(e) => handleDragStart(e, request.id)}
                onDragEnd={handleDragEnd}
              >
                <RequestCard 
                  request={request} 
                  isDragging={draggingId === request.id}
                />
              </div>
            ))}
            {columnRequests.length === 0 && (
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20">
                <p className="text-sm text-muted-foreground">No requests</p>
              </div>
            )}
          </KanbanColumn>
        );
      })}
    </div>
  );
}
