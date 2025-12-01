import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle } from 'lucide-react';

interface Location {
  id: number;
  name: string;
}

interface Crop {
  id: number;
  name: string;
}

interface Symptom {
  id: number;
  name: string;
}

interface Disease {
  name: string;
  description?: string;
  solution?: string;
}

interface Pesticide {
  name: string;
  dosage: string;
}

export const ReportDisease = () => {
  const [formData, setFormData] = useState({
    type: '',
    earTagNumber: '',
    cropAge: '',
    locationId: '',
    cropId: '',
    symptomIds: [] as number[],
    customSymptom: ''
  });
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [diseaseInfo, setDiseaseInfo] = useState<{disease?: Disease; pesticide?: Pesticide} | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingDisease, setFetchingDisease] = useState(false);
  
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load dropdown data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [locationsRes, cropsRes, symptomsRes] = await Promise.all([
          supabase.from('locations').select('id, name'),
          supabase.from('crops').select('id, name'),
          supabase.from('symptoms').select('id, name')
        ]);

        if (locationsRes.data) setLocations(locationsRes.data);
        if (cropsRes.data) setCrops(cropsRes.data);
        if (symptomsRes.data) setSymptoms(symptomsRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Fetch disease info for animals
  const fetchAnimalDisease = async (locationId: string, symptomIds: number[]) => {
    if (!locationId || symptomIds.length === 0) return;
    
    setFetchingDisease(true);
    try {
      const { data, error } = await supabase
        .from('location_symptoms')
        .select('disease:diseases(name,solution)')
        .eq('location_id', parseInt(locationId))
        .in('symptom_id', symptomIds);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const disease = data[0].disease;
        setDiseaseInfo({ disease });
      }
    } catch (error) {
      console.error('Error fetching disease info:', error);
    } finally {
      setFetchingDisease(false);
    }
  };

  // Fetch disease info for crops
  const fetchCropDisease = async (locationId: string, cropId: string) => {
    if (!locationId || !cropId) return;
    
    setFetchingDisease(true);
    try {
      const { data, error } = await supabase
        .from('crop_treatment')
        .select('disease:crop_diseases(name,description), pesticide:pesticides(name,dosage)')
        .eq('location_id', parseInt(locationId))
        .eq('crop_id', parseInt(cropId));

      if (error) throw error;
      
      if (data && data.length > 0) {
        const { disease, pesticide } = data[0];
        setDiseaseInfo({ disease, pesticide });
      }
    } catch (error) {
      console.error('Error fetching disease info:', error);
    } finally {
      setFetchingDisease(false);
    }
  };

  // Effect to fetch disease info when conditions are met
  useEffect(() => {
    if (formData.type === 'animal' && formData.locationId && formData.symptomIds.length > 0) {
      fetchAnimalDisease(formData.locationId, formData.symptomIds);
    } else if (formData.type === 'crop' && formData.locationId && formData.cropId) {
      fetchCropDisease(formData.locationId, formData.cropId);
    } else {
      setDiseaseInfo(null);
    }
  }, [formData.type, formData.locationId, formData.symptomIds, formData.cropId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.type) {
      toast({
        title: "Error",
        description: "Please select Animal or Crop",
        variant: "destructive"
      });
      return;
    }

    if (formData.type === 'animal') {
      if (!formData.earTagNumber || !formData.locationId || formData.symptomIds.length === 0) {
        toast({
          title: "Error",
          description: "Please fill in all required fields for animal report",
          variant: "destructive"
        });
        return;
      }
    }

    if (formData.type === 'crop') {
      if (!formData.locationId || !formData.cropId || !formData.cropAge) {
        toast({
          title: "Error",
          description: "Please fill in all required fields for crop report",
          variant: "destructive"
        });
        return;
      }
    }

    setLoading(true);

    try {
      if (formData.type === 'animal') {
        const reportData = {
          user_id: user?.id,
          ear_tag: formData.earTagNumber,
          location_id: parseInt(formData.locationId),
          symptom_ids: formData.symptomIds,
          disease_name: diseaseInfo?.disease?.name || null,
          solution: diseaseInfo?.disease?.solution || null
        };

        const { error } = await supabase
          .from('report_diseases')
          .insert(reportData);

        if (error) throw error;
      } else {
        const reportData = {
          user_id: user?.id,
          location_id: parseInt(formData.locationId),
          crop_id: parseInt(formData.cropId),
          crop_age: parseInt(formData.cropAge),
          symptom: formData.customSymptom || null,
          disease_name: diseaseInfo?.disease?.name || null,
          pesticide_name: diseaseInfo?.pesticide?.name || null,
          pesticide_dosage: diseaseInfo?.pesticide?.dosage || null
        };

        const { error } = await supabase
          .from('report_crops')
          .insert(reportData);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "✅ Report submitted successfully"
      });

      // Reset form
      setFormData({
        type: '',
        earTagNumber: '',
        cropAge: '',
        locationId: '',
        cropId: '',
        symptomIds: [],
        customSymptom: ''
      });
      
      // Keep disease info visible for a few seconds after submission
      setTimeout(() => {
        setDiseaseInfo(null);
      }, 5000);
      
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
            <CardTitle className="text-center">Report Disease</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Select Type</Label>
                <RadioGroup 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="animal" id="animal" />
                    <Label htmlFor="animal" className="cursor-pointer">Animal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="crop" id="crop" />
                    <Label htmlFor="crop" className="cursor-pointer">Crop</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Animal Form */}
              {formData.type === 'animal' && (
                <div className="space-y-4">
                  {/* Ear Tag Number */}
                  <div className="space-y-2">
                    <Label htmlFor="earTag">Ear Tag Number *</Label>
                    <Input
                      id="earTag"
                      placeholder="e.g., A001, B123"
                      value={formData.earTagNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, earTagNumber: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Select value={formData.locationId} onValueChange={(value) => setFormData(prev => ({ ...prev, locationId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id.toString()}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Symptoms */}
                  <div className="space-y-2">
                    <Label>Symptoms *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {symptoms.slice(0, -6).map((symptom) => (
                        <div key={symptom.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`symptom-${symptom.id}`}
                            checked={formData.symptomIds.includes(symptom.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData(prev => ({ ...prev, symptomIds: [...prev.symptomIds, symptom.id] }));
                              } else {
                                setFormData(prev => ({ ...prev, symptomIds: prev.symptomIds.filter(id => id !== symptom.id) }));
                              }
                            }}
                          />
                          <Label htmlFor={`symptom-${symptom.id}`} className="text-sm">
                            {symptom.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Crop Form */}
              {formData.type === 'crop' && (
                <div className="space-y-4">
                  {/* Location */}
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Select value={formData.locationId} onValueChange={(value) => setFormData(prev => ({ ...prev, locationId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id.toString()}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Crop Name */}
                  <div className="space-y-2">
                    <Label>Crop Name *</Label>
                    <Select value={formData.cropId} onValueChange={(value) => setFormData(prev => ({ ...prev, cropId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {crops.map((crop) => (
                          <SelectItem key={crop.id} value={crop.id.toString()}>
                            {crop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Crop Age */}
                  <div className="space-y-2">
                    <Label htmlFor="cropAge">Crop Age (days) *</Label>
                    <Input
                      id="cropAge"
                      type="number"
                      placeholder="Enter age in days"
                      value={formData.cropAge}
                      onChange={(e) => setFormData(prev => ({ ...prev, cropAge: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Optional Symptoms */}
                  <div className="space-y-2">
                    <Label htmlFor="customSymptom">Symptoms (optional)</Label>
                    <Input
                      id="customSymptom"
                      placeholder="Describe any symptoms"
                      value={formData.customSymptom}
                      onChange={(e) => setFormData(prev => ({ ...prev, customSymptom: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {/* Disease Information Card */}
              {diseaseInfo && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Disease Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {diseaseInfo.disease && (
                      <div>
                        <h4 className="font-medium text-green-800">Disease: {diseaseInfo.disease.name}</h4>
                        {diseaseInfo.disease.solution && (
                          <p className="text-sm text-green-700 mt-1">
                            <strong>Solution:</strong> {diseaseInfo.disease.solution}
                          </p>
                        )}
                        {diseaseInfo.disease.description && (
                          <p className="text-sm text-green-700 mt-1">
                            <strong>Description:</strong> {diseaseInfo.disease.description}
                          </p>
                        )}
                      </div>
                    )}
                    {diseaseInfo.pesticide && (
                      <div>
                        <h4 className="font-medium text-green-800">Pesticide: {diseaseInfo.pesticide.name}</h4>
                        <p className="text-sm text-green-700">
                          <strong>Dosage:</strong> {diseaseInfo.pesticide.dosage}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Loading indicator for disease fetch */}
              {fetchingDisease && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Fetching disease information...</span>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};