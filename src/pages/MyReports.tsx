import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useOffline } from '@/hooks/useOffline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

export const MyReports = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { pendingData } = useOffline();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    const { data } = await supabase
      .from('disease_reports')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    setReports(data || []);
  };

  const allReports = [...pendingData.diseaseReports, ...reports];

  return (
    <Layout>
      <div className="p-4 pb-20 space-y-4">
        <h1 className="text-xl font-bold text-center">{t('myReports')}</h1>
        
        {allReports.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No reports submitted yet</p>
            </CardContent>
          </Card>
        ) : (
          allReports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg capitalize">{report.type}</CardTitle>
                  <Badge variant={report.offline ? 'destructive' : 'default'}>
                    {report.offline ? 'Offline' : t(report.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{report.symptoms}</p>
                {report.ear_tag_number && (
                  <p className="text-xs text-muted-foreground">Tag: {report.ear_tag_number}</p>
                )}
                {report.crop_age && (
                  <p className="text-xs text-muted-foreground">Age: {report.crop_age} days</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
};