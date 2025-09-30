import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditReportDialogProps {
  report: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditReportDialog = ({ report, isOpen, onClose, onUpdate }: EditReportDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({});
  const [locations, setLocations] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const isAnimal = !!(report && typeof report === 'object' && Object.prototype.hasOwnProperty.call(report, 'ear_tag'));

  useEffect(() => {
    if (isOpen && report) {
      setFormData({
        location_id: report.location_id,
        ...(isAnimal ? {
          ear_tag: report.ear_tag,
        } : {
          crop_id: report.crop_id,
          crop_age: report.crop_age,
          symptom: report.symptom,
        })
      });
      fetchData();
    }
  }, [isOpen, report]);

  const fetchData = async () => {
    const [locationsRes, cropsRes] = await Promise.all([
      supabase.from('locations').select('*'),
      supabase.from('crops').select('*')
    ]);
    
    setLocations(locationsRes.data || []);
    setCrops(cropsRes.data || []);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const table = isAnimal ? 'report_diseases' : 'report_crops';
      const { error } = await supabase
        .from(table)
        .update(formData)
        .eq('id', report.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report updated successfully"
      });
      
      onUpdate();
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {isAnimal ? 'Animal' : 'Crop'} Report</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Select
              value={formData.location_id?.toString()}
              onValueChange={(value) => setFormData({...formData, location_id: parseInt(value)})}
            >
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

          {isAnimal ? (
            <div>
              <Label htmlFor="ear_tag">Ear Tag</Label>
              <Input
                id="ear_tag"
                value={formData.ear_tag || ''}
                onChange={(e) => setFormData({...formData, ear_tag: e.target.value})}
              />
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="crop">Crop</Label>
                <Select
                  value={formData.crop_id?.toString()}
                  onValueChange={(value) => setFormData({...formData, crop_id: parseInt(value)})}
                >
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
              
              <div>
                <Label htmlFor="crop_age">Crop Age (days)</Label>
                <Input
                  id="crop_age"
                  type="number"
                  value={formData.crop_age || ''}
                  onChange={(e) => setFormData({...formData, crop_age: parseInt(e.target.value)})}
                />
              </div>
              
              <div>
                <Label htmlFor="symptom">Symptoms</Label>
                <Textarea
                  id="symptom"
                  value={formData.symptom || ''}
                  onChange={(e) => setFormData({...formData, symptom: e.target.value})}
                  rows={3}
                />
              </div>
            </>
          )}
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="flex-1">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};