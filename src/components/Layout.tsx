import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useOffline } from '@/hooks/useOffline';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LogOut, Wifi, WifiOff } from 'lucide-react';
interface LayoutProps {
  children: React.ReactNode;
}
export const Layout = ({
  children
}: LayoutProps) => {
  const {
    user,
    signOut
  } = useAuth();
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const {
    isOnline,
    pendingData
  } = useOffline();
  const pendingCount = pendingData.diseaseReports.length + pendingData.queries.length;
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Fasal-Pashu Saathi</h1>
          
          <div className="flex items-center gap-2">
            {/* Offline indicator */}
            <div className="flex items-center gap-1">
              {isOnline ? <Wifi className="h-4 w-4 text-green-400" /> : <div className="flex items-center gap-1">
                  <WifiOff className="h-4 w-4 text-red-400" />
                  {pendingCount > 0 && <Badge variant="destructive" className="text-xs">
                      {pendingCount}
                    </Badge>}
                </div>}
            </div>

            {/* Language selector */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-20 h-8 text-xs bg-primary-foreground text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">EN</SelectItem>
                <SelectItem value="hindi">हिं</SelectItem>
                <SelectItem value="kannada">ಕನ್ನ</SelectItem>
              </SelectContent>
            </Select>

            {/* Logout */}
            {user && <Button variant="ghost" size="sm" onClick={signOut} className="text-primary-foreground hover:bg-primary-foreground/20">
                <LogOut className="h-4 w-4" />
              </Button>}
          </div>
        </div>
      </header>

      {/* Offline notification */}
      {!isOnline && <div className="bg-yellow-500 text-yellow-900 p-2 text-center text-sm">
          {t('offlineMode')} - {t('dataWillSync')}
        </div>}

      {/* Main content */}
      <main className="max-w-md mx-auto">
        {children}
      </main>
    </div>;
};