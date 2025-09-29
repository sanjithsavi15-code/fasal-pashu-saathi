import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, MessageCircle, Users, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    totalQueries: 0,
    openQueries: 0
  });
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [recentQueries, setRecentQueries] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch reports stats
      const { data: reports } = await supabase
        .from('report_diseases')
        .select('*');
      
      const { data: queries } = await supabase
        .from('farmer_queries')
        .select('*');

      // Fetch recent reports
      const { data: recentReportsData } = await supabase
        .from('report_diseases')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent queries
      const { data: recentQueriesData } = await supabase
        .from('farmer_queries')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalReports: reports?.length || 0,
        pendingReports: 0, // Remove status filtering since no status field
        totalQueries: queries?.length || 0,
        openQueries: queries?.filter(q => q.status === 'open').length || 0
      });

      setRecentReports(recentReportsData || []);
      setRecentQueries(recentQueriesData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
      case 'open':
        return 'destructive';
      case 'in_progress':
      case 'reviewed':
        return 'secondary';
      case 'resolved':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-6 pb-20">
        <h1 className="text-2xl font-bold text-center">{t('dashboard')}</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReports}</div>
              <div className="text-xs text-muted-foreground">
                {stats.pendingReports} pending
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQueries}</div>
              <div className="text-xs text-muted-foreground">
                {stats.openQueries} open
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReports.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No reports yet</p>
            ) : (
              recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{report.profiles?.name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {report.type} - {report.symptoms.substring(0, 50)}...
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(report.status)}>
                    {t(report.status)}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Queries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentQueries.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No queries yet</p>
            ) : (
              recentQueries.map((query) => (
                <div key={query.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{query.profiles?.name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">
                      {query.subject}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(query.status)}>
                    {t(query.status === 'open' ? 'pending' : query.status)}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};