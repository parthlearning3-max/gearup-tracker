import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Wrench, 
  Users, 
  Cog,
  Calendar,
  ClipboardList,
  Shield
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Requests', href: '/requests', icon: ClipboardList },
  { name: 'Equipment', href: '/equipment', icon: Cog },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 gradient-dark">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-glow-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-sidebar-foreground">GearGuard</h1>
            <p className="text-xs text-sidebar-foreground/60">Maintenance Tracker</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary shadow-soft'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <item.icon className={cn(
                  'h-5 w-5 transition-colors',
                  isActive ? 'text-sidebar-primary' : ''
                )} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/30 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center">
              <span className="text-xs font-bold text-sidebar-primary-foreground">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">Manager</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
