-- Create report_diseases table for animal reports
CREATE TABLE public.report_diseases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ear_tag VARCHAR(50) NOT NULL,
  location_id BIGINT REFERENCES public.locations(id),
  symptom_ids BIGINT[] NOT NULL,
  disease_name TEXT,
  solution TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create report_crops table for crop reports
CREATE TABLE public.report_crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id BIGINT REFERENCES public.locations(id),
  crop_id BIGINT REFERENCES public.crops(id),
  crop_age INTEGER NOT NULL,
  symptom TEXT,
  disease_name TEXT,
  pesticide_name TEXT,
  pesticide_dosage TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.report_diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_crops ENABLE ROW LEVEL SECURITY;

-- Create policies for report_diseases
CREATE POLICY "Users can view their own disease reports" 
ON public.report_diseases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own disease reports" 
ON public.report_diseases 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own disease reports" 
ON public.report_diseases 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own disease reports" 
ON public.report_diseases 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for report_crops
CREATE POLICY "Users can view their own crop reports" 
ON public.report_crops 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own crop reports" 
ON public.report_crops 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crop reports" 
ON public.report_crops 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crop reports" 
ON public.report_crops 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_report_diseases_updated_at
BEFORE UPDATE ON public.report_diseases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_report_crops_updated_at
BEFORE UPDATE ON public.report_crops
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add unique constraint to locations table name column
ALTER TABLE public.locations ADD CONSTRAINT locations_name_unique UNIQUE (name);

-- Seed Karnataka districts in locations table if not already present
INSERT INTO public.locations (name, climate) VALUES
('Bangalore Urban', 'Pleasant tropical climate'),
('Bangalore Rural', 'Pleasant tropical climate'),
('Mysore', 'Pleasant tropical climate'),
('Tumkur', 'Semi-arid climate'),
('Hassan', 'Pleasant tropical climate'),
('Mandya', 'Pleasant tropical climate'),
('Chitradurga', 'Semi-arid climate'),
('Davangere', 'Semi-arid climate'),
('Shimoga', 'Pleasant tropical climate'),
('Kolar', 'Semi-arid climate')
ON CONFLICT (name) DO NOTHING;