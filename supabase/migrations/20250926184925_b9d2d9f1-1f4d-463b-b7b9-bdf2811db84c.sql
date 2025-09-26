-- Enable RLS on disease_medicine_mrl table (the existing table)
ALTER TABLE public.disease_medicine_mrl ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access to medicine/MRL data
-- This makes sense since farmers need to access medicine guidelines
CREATE POLICY "Public read access to medicine MRL data" 
ON public.disease_medicine_mrl 
FOR SELECT 
USING (true);