import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, FileText, MessageCircle, Info, BarChart3, Leaf } from 'lucide-react';
export const Home = () => {
  const {
    t
  } = useLanguage();
  const {
    user
  } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    reports: 0,
    queries: 0
  });
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserStats();
    }
  }, [user]);
  const fetchProfile = async () => {
    if (!user) return;
    const {
      data
    } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
    setProfile(data);
  };
  const fetchUserStats = async () => {
    if (!user) return;
    const [reportsRes, queriesRes] = await Promise.all([supabase.from('disease_reports').select('id').eq('user_id', user.id), supabase.from('farmer_queries').select('id').eq('user_id', user.id)]);
    setStats({
      reports: reportsRes.data?.length || 0,
      queries: queriesRes.data?.length || 0
    });
  };
  const quickActions = [{
    to: '/report',
    icon: PlusCircle,
    title: t('reportDisease'),
    description: 'Report animal or crop disease symptoms',
    color: 'bg-primary text-primary-foreground'
  }, {
    to: '/reports',
    icon: FileText,
    title: t('myReports'),
    description: `${stats.reports} reports submitted`,
    color: 'bg-blue-500 text-white'
  }, {
    to: '/queries',
    icon: MessageCircle,
    title: t('queries'),
    description: `${stats.queries} queries sent`,
    color: 'bg-green-500 text-white'
  }, {
    to: '/info',
    icon: Info,
    title: t('information'),
    description: 'App instructions and guidelines',
    color: 'bg-orange-500 text-white'
  }];
  return <Layout>
      <div className="p-4 space-y-6 pb-20">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Fasal-Pashu Saathi</h1>
          </div>
          
          <p className="text-lg font-medium">
            Welcome{profile?.name ? `, ${profile.name}` : ''}!
          </p>
          <p className="text-muted-foreground">
            Your digital farming companion for disease management
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map(({
            to,
            icon: Icon,
            title,
            description,
            color
          }) => <Link key={to} to={to}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{title}</h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>)}
          </div>
        </div>

        {/* Admin Dashboard Link */}
        {profile?.is_admin && <Card className="border-primary/20">
            <CardContent className="p-4">
              <Link to="/dashboard">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{t('dashboard')}</h3>
                      <Badge variant="secondary">Admin</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      View all reports and manage farmer queries
                    </p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>}

        {/* Information Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Important Information</h2>
          
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4">
              <h3 className="font-medium text-green-800 mb-2">
                Maximum Residue Limits (MRL)
              </h3>
              <p className="text-sm text-green-700">
                Always follow MRL guidelines when using medicines to ensure food safety and export compliance.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-medium text-blue-800 mb-2">
                Antimicrobial Usage (AMU)
              </h3>
              <p className="text-sm text-blue-700">
                Responsible use of antimicrobials helps prevent resistance and maintains treatment effectiveness.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>;
};