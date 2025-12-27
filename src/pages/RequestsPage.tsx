import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { KanbanBoard } from '@/components/requests/KanbanBoard';
import { CreateRequestDialog } from '@/components/requests/CreateRequestDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function RequestsPage() {
  const { requests, equipment, teams } = useMaintenance();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const equipmentFilter = searchParams.get('equipment');
  const filteredEquipment = equipmentFilter 
    ? equipment.find(e => e.id === equipmentFilter) 
    : null;

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setFilterTeam('all');
    setFilterType('all');
  };

  const hasActiveFilters = equipmentFilter || searchQuery || filterTeam !== 'all' || filterType !== 'all';

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Maintenance Requests</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all maintenance work orders
            </p>
          </div>
          <CreateRequestDialog preselectedEquipmentId={equipmentFilter || undefined} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={filterTeam} onValueChange={setFilterTeam}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
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

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="corrective">Corrective</SelectItem>
              <SelectItem value="preventive">Preventive</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Equipment Filter Badge */}
        {filteredEquipment && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">
              Showing requests for: <strong>{filteredEquipment.name}</strong>
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchParams({})}
              className="ml-auto h-7 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Stats Summary */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="new">New</Badge>
            <span className="text-muted-foreground">
              {requests.filter(r => r.status === 'new').length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="progress">In Progress</Badge>
            <span className="text-muted-foreground">
              {requests.filter(r => r.status === 'in_progress').length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="complete">Repaired</Badge>
            <span className="text-muted-foreground">
              {requests.filter(r => r.status === 'repaired').length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="overdue">Overdue</Badge>
            <span className="text-muted-foreground">
              {requests.filter(r => r.isOverdue).length}
            </span>
          </div>
        </div>

        {/* Kanban Board */}
        <KanbanBoard />
      </div>
    </MainLayout>
  );
}
