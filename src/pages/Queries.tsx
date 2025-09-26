import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useOffline } from '@/hooks/useOffline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const Queries = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isOnline, addPendingQuery, pendingData } = useOffline();
  const { toast } = useToast();
  const [queries, setQueries] = useState<any[]>([]);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchQueries();
  }, [user]);

  const fetchQueries = async () => {
    const { data } = await supabase
      .from('farmer_queries')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    setQueries(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) return;

    setLoading(true);
    try {
      const queryData = {
        user_id: user?.id,
        subject: formData.subject,
        message: formData.message
      };

      if (isOnline) {
        await supabase.from('farmer_queries').insert(queryData);
        fetchQueries();
      } else {
        addPendingQuery(queryData);
      }

      toast({ title: "Success", description: "Query submitted successfully" });
      setFormData({ subject: '', message: '' });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const allQueries = [...pendingData.queries, ...queries];

  return (
    <Layout>
      <div className="p-4 pb-20 space-y-6">
        <h1 className="text-xl font-bold text-center">{t('queries')}</h1>

        <Card>
          <CardHeader>
            <CardTitle>{t('submitQuery')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject">{t('subject')}</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">{t('message')}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {t('submitQuery')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t('myQueries')}</h2>
          {allQueries.map((query) => (
            <Card key={query.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{query.subject}</CardTitle>
                  <Badge variant={query.offline ? 'destructive' : 'default'}>
                    {query.offline ? 'Offline' : t(query.status === 'open' ? 'pending' : query.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{query.message}</p>
                {query.admin_response && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Response:</p>
                    <p className="text-sm">{query.admin_response}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};