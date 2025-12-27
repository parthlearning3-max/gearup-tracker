import { useMaintenance } from '@/contexts/MaintenanceContext';
import { Equipment } from '@/types/maintenance';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Cog, 
  Truck, 
  Monitor, 
  Package,
  MapPin,
  Calendar,
  Wrench,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface EquipmentCardProps {
  equipment: Equipment;
}

const categoryIcons = {
  machine: Cog,
  vehicle: Truck,
  computer: Monitor,
  other: Package,
};

const categoryColors = {
  machine: 'bg-blue-500/10 text-blue-600',
  vehicle: 'bg-emerald-500/10 text-emerald-600',
  computer: 'bg-purple-500/10 text-purple-600',
  other: 'bg-gray-500/10 text-gray-600',
};

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const { getTeamById, getRequestsByEquipment } = useMaintenance();
  const navigate = useNavigate();
  
  const team = getTeamById(equipment.maintenanceTeamId);
  const openRequests = getRequestsByEquipment(equipment.id).filter(
    r => r.status !== 'repaired' && r.status !== 'scrap'
  );
  
  const CategoryIcon = categoryIcons[equipment.category];
  const isWarrantyExpired = equipment.warrantyExpiry && new Date(equipment.warrantyExpiry) < new Date();

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-elevated hover:border-primary/20 animate-fade-in-up">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              categoryColors[equipment.category]
            )}>
              <CategoryIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">{equipment.name}</h3>
              <p className="text-xs text-muted-foreground">{equipment.serialNumber}</p>
            </div>
          </div>
          <Badge variant={equipment.isActive ? 'complete' : 'scrap'} className="text-[10px]">
            {equipment.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{equipment.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(equipment.purchaseDate), 'MMM yyyy')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {team && (
              <Badge variant="outline" className="text-[10px]">
                <div 
                  className="h-1.5 w-1.5 rounded-full mr-1.5" 
                  style={{ backgroundColor: team.color }}
                />
                {team.name}
              </Badge>
            )}
            {equipment.warrantyExpiry && (
              <Badge 
                variant={isWarrantyExpired ? 'overdue' : 'outline'} 
                className="text-[10px]"
              >
                {isWarrantyExpired ? 'Warranty Expired' : 'Under Warranty'}
              </Badge>
            )}
          </div>
        </div>

        {/* Smart Button - Maintenance Requests */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between group-hover:border-primary/50"
          onClick={() => navigate(`/requests?equipment=${equipment.id}`)}
        >
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <span>Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            {openRequests.length > 0 && (
              <Badge variant="new" className="text-[10px] px-1.5">
                {openRequests.length}
              </Badge>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}
