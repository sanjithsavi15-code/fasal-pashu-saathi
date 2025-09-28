-- Enable RLS on all public tables that need it
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesticides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_treatment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_symptoms ENABLE ROW LEVEL SECURITY;

-- Create public read policies for reference tables (these should be readable by all authenticated users)
CREATE POLICY "Authenticated users can view crops" ON public.crops FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view diseases" ON public.diseases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view locations" ON public.locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view symptoms" ON public.symptoms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view pesticides" ON public.pesticides FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view crop diseases" ON public.crop_diseases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view crop treatment" ON public.crop_treatment FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view location symptoms" ON public.location_symptoms FOR SELECT TO authenticated USING (true);