import React from 'react';
import { useAppContext } from '../App';
import { UserRole } from '../types';
import { Button } from './Button';
import { LogOut, Home, User, Search, Bell, Wrench } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout, currentRoute, navigateTo, notifications } = useAppContext();

  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  return (
    <div className="min-h-screen bg-neutral-light flex flex-col pb-24 md:pb-0 font-sans text-neutral-dark">
      {/* Mobile Header */}
      <header className="bg-white pt-[calc(1.5rem+env(safe-area-inset-top))] pb-2 px-6 md:hidden sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Avatar Placeholder */}
                <div className="w-12 h-12 bg-primary rounded-full overflow-hidden border-2 border-primary p-0.5">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email}`} alt="avatar" className="w-full h-full bg-white rounded-full" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold font-mono leading-tight text-primary">{currentUser?.name}</h1>
                    <span className="text-xs text-gray-500 font-medium">{currentUser?.role === UserRole.MECHANIC ? 'Lead Mechanic' : 'Car Owner'}</span>
                </div>
            </div>
            <button className="relative p-2 active:scale-95 transition-transform" onClick={() => navigateTo('NOTIFICATIONS')}>
                <Bell className="w-6 h-6 text-primary" />
                {unreadCount > 0 && <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-accent border-2 border-white rounded-full"></span>}
            </button>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="bg-primary text-white sticky top-0 z-30 hidden md:block shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('DASHBOARD')}>
             <div className="bg-white/10 p-1.5 rounded-lg">
                <Wrench className="w-5 h-5 text-secondary" />
             </div>
             <span className="font-bold text-xl font-mono tracking-tighter">AUTO<span className="text-secondary">DOC</span></span>
          </div>
          
          <div className="flex items-center gap-6">
             <nav className="flex gap-4">
                <a onClick={() => navigateTo('DASHBOARD')} className="font-bold text-sm hover:text-secondary cursor-pointer transition-colors">Jobs</a>
                <a onClick={() => navigateTo('NOTIFICATIONS')} className="font-bold text-sm hover:text-secondary cursor-pointer relative transition-colors">
                    Notifications
                    {unreadCount > 0 && <span className="absolute -top-1 -right-2 w-2 h-2 bg-accent rounded-full"></span>}
                </a>
                <a onClick={() => navigateTo('PROFILE')} className="font-bold text-sm hover:text-secondary cursor-pointer transition-colors">Profile</a>
             </nav>
            <div className="flex items-center gap-3 pl-6 border-l border-white/20">
              <span className="text-sm font-bold">{currentUser?.name}</span>
              <button className="text-white/80 hover:text-white" onClick={logout}>
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8 max-w-5xl">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 md:hidden pb-[env(safe-area-inset-bottom)] rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-around h-20 px-6">
          <NavButton 
            icon={<Home className="w-6 h-6" />} 
            active={currentRoute === 'DASHBOARD'} 
            onClick={() => navigateTo('DASHBOARD')}
          />
          {currentUser?.role === UserRole.MECHANIC && (
             <NavButton 
                icon={<Search className="w-6 h-6 stroke-[3]" />} 
                active={currentRoute === 'DASHBOARD'} // Search maps to Dashboard for now
                onClick={() => navigateTo('DASHBOARD')} 
             />
          )}
          <NavButton 
            icon={<User className="w-6 h-6 stroke-[3]" />} 
            active={currentRoute === 'PROFILE'} 
            onClick={() => navigateTo('PROFILE')}
          />
           <button 
            onClick={logout}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors active:scale-90"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ icon, active, onClick }: { icon: React.ReactNode, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all active:scale-90 ${active ? 'bg-primary/5 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon}
    {active && <span className="absolute bottom-2 w-1 h-1 bg-primary rounded-full"></span>}
  </button>
);