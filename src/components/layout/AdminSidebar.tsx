import { LayoutDashboard, Users, Wheat, LogOut, Menu, X } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Farmers', url: '/farmers', icon: Users },
  { title: 'Crop Batches', url: '/crops', icon: Wheat },
];

// Sidebar content component (shared between desktop and mobile)
function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Wheat className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Farmer Admin</h1>
            <p className="text-xs text-sidebar-foreground/70">Management Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.url}>
              <NavLink
                to={item.url}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-sidebar-accent"
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                onClick={onNavClick}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-4 px-4 py-2">
          <p className="text-sm text-sidebar-foreground/70">Logged in as</p>
          <p className="text-sm font-medium truncate">{admin?.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </>
  );
}

// Desktop Sidebar
export function AdminSidebar() {
  return (
    <aside className="hidden md:flex w-64 min-h-screen bg-sidebar text-sidebar-foreground flex-col border-r border-sidebar-border">
      <SidebarContent />
    </aside>
  );
}

// Mobile Header with hamburger menu
export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close sheet when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="md:hidden sticky top-0 z-40 flex items-center justify-between p-4 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
          <Wheat className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <h1 className="font-bold">Farmer Admin</h1>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-sidebar-foreground">
            <Menu className="w-6 h-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border">
          <div className="flex flex-col h-full">
            <SidebarContent onNavClick={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
