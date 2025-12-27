export type RequestStatus = 'new' | 'in_progress' | 'repaired' | 'scrap';
export type RequestType = 'corrective' | 'preventive';
export type EquipmentCategory = 'machine' | 'vehicle' | 'computer' | 'other';

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: EquipmentCategory;
  department: string;
  assignedTo?: string;
  location: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  maintenanceTeamId: string;
  defaultTechnicianId?: string;
  isActive: boolean;
  notes?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  color: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  teamId: string;
  avatar?: string;
  role: 'technician' | 'manager';
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description?: string;
  type: RequestType;
  status: RequestStatus;
  equipmentId: string;
  teamId: string;
  assignedToId?: string;
  createdById: string;
  createdAt: string;
  scheduledDate?: string;
  completedAt?: string;
  duration?: number; // in minutes
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isOverdue: boolean;
}

export interface Department {
  id: string;
  name: string;
}
