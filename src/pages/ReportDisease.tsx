import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useOffline } from '@/hooks/useOffline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export const ReportDisease = () => {
  const [formData, setFormData] = useState({
    type: '',
    symptoms: '',
    earTagNumber: '',
    cropAge: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isOnline, addPendingDiseaseReport } = useOffline();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.symptoms) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const reportData = {
        user_id: user?.id,
        type: formData.type,
        symptoms: formData.symptoms,
        ear_tag_number: formData.type === 'animal' ? formData.earTagNumber : null,
        crop_age: formData.type === 'crop' ? formData.cropAge : null,
        location: formData.location
      };

      if (isOnline) {
        const { error } = await supabase
          .from('disease_reports')
          .insert(reportData);

        if (error) throw error;
      } else {
        addPendingDiseaseReport(reportData);
      }

      toast({
        title: "Success",
        description: isOnline 
          ? "Disease report submitted successfully" 
          : "Report saved offline. Will sync when connection is restored.",
      });

      navigate('/reports');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 pb-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{t('reportDisease')}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">{t('selectType')}</Label>
                <RadioGroup 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="animal" id="animal" />
                    <Label htmlFor="animal" className="cursor-pointer">{t('animal')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="crop" id="crop" />
                    <Label htmlFor="crop" className="cursor-pointer">{t('crop')}</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <Label htmlFor="symptoms">{t('symptoms')} *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe the symptoms you have observed..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              {/* Conditional Fields */}
              {formData.type === 'animal' && (
                <div className="space-y-2">
                  <Label htmlFor="earTag">{t('earTagNumber')}</Label>
                  <Input
                    id="earTag"
                    placeholder="e.g., A001, B123"
                    value={formData.earTagNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, earTagNumber: e.target.value }))}
                  />
                </div>
              )}

              {formData.type === 'crop' && (
                <div className="space-y-2">
                  <Label htmlFor="cropAge">{t('cropAge')}</Label>
                  <Input
                    id="cropAge"
                    type="number"
                    placeholder="Enter age in days"
                    value={formData.cropAge}
                    onChange={(e) => setFormData(prev => ({ ...prev, cropAge: e.target.value }))}
                  />
                </div>
              )}

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">{t('location')}</Label>
                <Input
                  id="location"
                  placeholder="Village, District, State"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('submitReport')}
              </Button>

              {!isOnline && (
                <p className="text-sm text-orange-600 text-center">
                  {t('offlineMode')} - {t('dataWillSync')}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};