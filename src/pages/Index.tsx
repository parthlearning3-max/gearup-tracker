import { useMaintenance } from '@/contexts/MaintenanceContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RequestCard } from '@/components/requests/RequestCard';
import { CreateRequestDialog } from '@/components/requests/CreateRequestDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Cog,
  Users,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { requests, equipment, teams } = useMaintenance();

  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'repaired').length,
    overdue: requests.filter(r => r.isOverdue).length,
    activeEquipment: equipment.filter(e => e.isActive).length,
  };

  const recentRequests = requests
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const urgentRequests = requests.filter(r => r.isOverdue || r.priority === 'urgent');

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your maintenance overview.
            </p>
          </div>
          <CreateRequestDialog />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="New Requests"
            value={stats.new}
            icon={Clock}
            variant="primary"
            subtitle="Awaiting assignment"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Wrench}
            variant="warning"
            subtitle="Currently being worked on"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            variant="success"
            subtitle="This month"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={AlertTriangle}
            variant="accent"
            subtitle="Needs attention"
          />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-foreground">Equipment</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/equipment" className="gap-1">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Cog className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-foreground">{stats.activeEquipment}</p>
                <p className="text-sm text-muted-foreground">Active assets</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-foreground">Teams</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/teams" className="gap-1">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                <Users className="h-7 w-7 text-accent" />
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-foreground">{teams.length}</p>
                <p className="text-sm text-muted-foreground">Maintenance teams</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Requests */}
          <div className="lg:col-span-2 rounded-xl border bg-card shadow-soft">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="font-display font-semibold text-foreground">Recent Requests</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/requests" className="gap-1">
                  View Kanban <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
              {recentRequests.length === 0 && (
                <div className="col-span-2 py-12 text-center text-muted-foreground">
                  No requests yet. Create your first maintenance request!
                </div>
              )}
            </div>
          </div>

          {/* Urgent/Overdue */}
          <div className="rounded-xl border bg-card shadow-soft">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Needs Attention
              </h3>
              <Badge variant="overdue">{urgentRequests.length}</Badge>
            </div>
            <div className="p-4 space-y-3">
              {urgentRequests.slice(0, 4).map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
              {urgentRequests.length === 0 && (
                <div className="py-8 text-center">
                  <CheckCircle className="h-10 w-10 text-status-complete/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">All caught up!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
