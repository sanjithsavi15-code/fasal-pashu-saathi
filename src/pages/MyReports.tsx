import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditReportDialog } from '@/components/EditReportDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Edit, Trash2, Phone } from 'lucide-react';

interface AnimalReport {
  id: string;
  ear_tag: string;
  location_id: number;
  symptom_ids: number[];
  disease_name: string | null;
  solution: string | null;
  created_at: string;
  locations?: { name: string };
}

interface CropReport {
  id: string;
  location_id: number;
  crop_id: number;
  crop_age: number;
  symptom: string | null;
  disease_name: string | null;
  pesticide_name: string | null;
  pesticide_dosage: string | null;
  created_at: string;
  locations?: { name: string };
  crops?: { name: string };
}

export const MyReports = () => {
  const [animalReports, setAnimalReports] = useState<AnimalReport[]>([]);
  const [cropReports, setCropReports] = useState<CropReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState<any>(null);
  
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      // Fetch animal reports
      const { data: animalData, error: animalError } = await supabase
        .from('report_diseases')
        .select(`
          *,
          locations:location_id(name)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (animalError) {
        console.error('Error fetching animal reports:', animalError);
      } else if (animalData) {
        setAnimalReports(animalData);
      }

      // Fetch crop reports
      const { data: cropData, error: cropError } = await supabase
        .from('report_crops')
        .select(`
          *,
          locations:location_id(name),
          crops:crop_id(name)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (cropError) {
        console.error('Error fetching crop reports:', cropError);
      } else if (cropData) {
        setCropReports(cropData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (report: any) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      const table = 'ear_tag' in report ? 'report_diseases' : 'report_crops';
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', report.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report deleted successfully"
      });
      
      fetchReports();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleContactExpert = () => {
    toast({
      title: "Contact Expert",
      description: "Feature coming soon! You'll be able to contact nearest experts for advice."
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-4 pb-20">
          <div className="text-center">Loading reports...</div>
        </div>
      </Layout>
    );
  }

  const allReports = [...animalReports, ...cropReports].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Layout>
      <div className="p-4 pb-20 space-y-4">
        <h1 className="text-xl font-bold text-center">My Reports</h1>
        
        {allReports.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No reports submitted yet</p>
              <p className="text-sm text-muted-foreground mt-1">Submit your first disease report to see it here!</p>
            </CardContent>
          </Card>
        ) : (
          allReports.map((report) => {
            const isAnimal = report && 'ear_tag' in report;
            return (
              <Card key={report.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {isAnimal ? `Animal Report - ${(report as AnimalReport).ear_tag}` : `Crop Report - ${(report as CropReport).crops?.name}`}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={isAnimal ? 'default' : 'secondary'}>
                        {isAnimal ? 'Animal' : 'Crop'}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingReport(report)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(report)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleContactExpert}
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Location:</strong> {report.locations?.name || 'Unknown'}</p>
                  
                  {isAnimal ? (
                    <>
                      <p><strong>Ear Tag:</strong> {(report as AnimalReport).ear_tag}</p>
                      <p><strong>Symptom IDs:</strong> {(report as AnimalReport).symptom_ids.join(', ')}</p>
                      {(report as AnimalReport).disease_name && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p><strong>Disease:</strong> {(report as AnimalReport).disease_name}</p>
                          {(report as AnimalReport).solution && (
                            <p><strong>Solution:</strong> {(report as AnimalReport).solution}</p>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p><strong>Crop:</strong> {(report as CropReport).crops?.name || 'Unknown'}</p>
                      <p><strong>Age:</strong> {(report as CropReport).crop_age} days</p>
                      {(report as CropReport).symptom && <p><strong>Symptoms:</strong> {(report as CropReport).symptom}</p>}
                      {(report as CropReport).disease_name && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p><strong>Disease:</strong> {(report as CropReport).disease_name}</p>
                          {(report as CropReport).pesticide_name && (
                            <p><strong>Pesticide:</strong> {(report as CropReport).pesticide_name}</p>
                          )}
                          {(report as CropReport).pesticide_dosage && (
                            <p><strong>Dosage:</strong> {(report as CropReport).pesticide_dosage}</p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  
                  <p className="text-sm text-gray-500">
                    Submitted: {format(new Date(report.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
        
        <EditReportDialog
          report={editingReport}
          isOpen={!!editingReport}
          onClose={() => setEditingReport(null)}
          onUpdate={fetchReports}
        />
      </div>
    </Layout>
  );
};