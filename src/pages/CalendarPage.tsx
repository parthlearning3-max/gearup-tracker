import { MainLayout } from '@/components/layout/MainLayout';
import { MaintenanceCalendar } from '@/components/calendar/MaintenanceCalendar';

export default function CalendarPage() {
  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Maintenance Calendar</h1>
          <p className="text-muted-foreground mt-1">
            View and schedule preventive maintenance
          </p>
        </div>

        {/* Calendar */}
        <MaintenanceCalendar />
      </div>
    </MainLayout>
  );
}
