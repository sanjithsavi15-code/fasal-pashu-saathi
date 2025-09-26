import { NavLink } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Home, FileText, MessageCircle, Info, BarChart3, PlusCircle } from 'lucide-react';

export const Navigation = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const navItems = [
    { to: '/', icon: Home, label: t('home') },
    { to: '/report', icon: PlusCircle, label: t('reportDisease') },
    { to: '/reports', icon: FileText, label: t('myReports') },
    { to: '/queries', icon: MessageCircle, label: t('queries') },
    { to: '/info', icon: Info, label: t('information') },
  ];

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};