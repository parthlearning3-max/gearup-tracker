import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Equipment, Team, TeamMember, MaintenanceRequest, Department } from '@/types/maintenance';
import { equipment as initialEquipment, teams as initialTeams, teamMembers as initialTeamMembers, maintenanceRequests as initialRequests, departments as initialDepartments } from '@/data/mockData';

interface MaintenanceContextType {
  equipment: Equipment[];
  teams: Team[];
  teamMembers: TeamMember[];
  requests: MaintenanceRequest[];
  departments: Department[];
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  addRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'isOverdue'>) => void;
  updateRequest: (id: string, request: Partial<MaintenanceRequest>) => void;
  updateRequestStatus: (id: string, status: MaintenanceRequest['status']) => void;
  getEquipmentById: (id: string) => Equipment | undefined;
  getTeamById: (id: string) => Team | undefined;
  getTeamMemberById: (id: string) => TeamMember | undefined;
  getRequestsByEquipment: (equipmentId: string) => MaintenanceRequest[];
  getTeamMembersByTeam: (teamId: string) => TeamMember[];
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests);
  const [departments] = useState<Department[]>(initialDepartments);

  const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    setEquipment(prev => [...prev, { ...newEquipment, id: generateId('equip') }]);
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEquipment = (id: string) => {
    setEquipment(prev => prev.filter(e => e.id !== id));
  };

  const addTeam = (newTeam: Omit<Team, 'id'>) => {
    setTeams(prev => [...prev, { ...newTeam, id: generateId('team') }]);
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addTeamMember = (newMember: Omit<TeamMember, 'id'>) => {
    setTeamMembers(prev => [...prev, { ...newMember, id: generateId('user') }]);
  };

  const addRequest = (newRequest: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'isOverdue'>) => {
    const request: MaintenanceRequest = {
      ...newRequest,
      id: generateId('req'),
      createdAt: new Date().toISOString(),
      isOverdue: false,
    };
    setRequests(prev => [...prev, request]);
  };

  const updateRequest = (id: string, updates: Partial<MaintenanceRequest>) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const updateRequestStatus = (id: string, status: MaintenanceRequest['status']) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updates: Partial<MaintenanceRequest> = { status };
      if (status === 'repaired') {
        updates.completedAt = new Date().toISOString();
      }
      return { ...r, ...updates };
    }));
  };

  const getEquipmentById = (id: string) => equipment.find(e => e.id === id);
  const getTeamById = (id: string) => teams.find(t => t.id === id);
  const getTeamMemberById = (id: string) => teamMembers.find(m => m.id === id);
  const getRequestsByEquipment = (equipmentId: string) => requests.filter(r => r.equipmentId === equipmentId);
  const getTeamMembersByTeam = (teamId: string) => teamMembers.filter(m => m.teamId === teamId);

  return (
    <MaintenanceContext.Provider value={{
      equipment,
      teams,
      teamMembers,
      requests,
      departments,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      addTeam,
      updateTeam,
      addTeamMember,
      addRequest,
      updateRequest,
      updateRequestStatus,
      getEquipmentById,
      getTeamById,
      getTeamMemberById,
      getRequestsByEquipment,
      getTeamMembersByTeam,
    }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
}
