import { useState, useMemo } from 'react';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { CreateEquipmentDialog } from '@/components/equipment/CreateEquipmentDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, LayoutGrid, List, Cog, Truck, Monitor, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'machine', label: 'Machines', icon: Cog },
  { value: 'vehicle', label: 'Vehicles', icon: Truck },
  { value: 'computer', label: 'Computers', icon: Monitor },
  { value: 'other', label: 'Other', icon: Package },
];

export default function EquipmentPage() {
  const { equipment, departments, teams } = useMaintenance();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredEquipment = useMemo(() => {
    return equipment.filter((eq) => {
      const matchesSearch = 
        eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || eq.category === filterCategory;
      const matchesDepartment = filterDepartment === 'all' || eq.department === filterDepartment;

      return matchesSearch && matchesCategory && matchesDepartment;
    });
  }, [equipment, searchQuery, filterCategory, filterDepartment]);

  const categoryCounts = useMemo(() => ({
    all: equipment.length,
    machine: equipment.filter(e => e.category === 'machine').length,
    vehicle: equipment.filter(e => e.category === 'vehicle').length,
    computer: equipment.filter(e => e.category === 'computer').length,
    other: equipment.filter(e => e.category === 'other').length,
  }), [equipment]);

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Equipment</h1>
            <p className="text-muted-foreground mt-1">
              Manage all company assets and their maintenance assignments
            </p>
          </div>
          <CreateEquipmentDialog />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((cat) => {
            const count = categoryCounts[cat.value as keyof typeof categoryCounts];
            return (
              <Button
                key={cat.value}
                variant={filterCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterCategory(cat.value)}
                className="gap-2"
              >
                {cat.icon && <cat.icon className="h-4 w-4" />}
                {cat.label}
                <Badge 
                  variant={filterCategory === cat.value ? 'secondary' : 'outline'}
                  className="ml-1 text-[10px] px-1.5"
                >
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-lg p-1 ml-auto">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredEquipment.length} of {equipment.length} equipment
        </p>

        {/* Equipment Grid */}
        <div className={cn(
          'gap-4',
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'flex flex-col'
        )}>
          {filteredEquipment.map((eq) => (
            <EquipmentCard key={eq.id} equipment={eq} />
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Cog className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-display font-semibold text-foreground mb-2">No equipment found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <CreateEquipmentDialog />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
