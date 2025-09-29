-- Add some sample crops
INSERT INTO public.crops (name) VALUES
('Rice'),
('Wheat'),
('Cotton'),
('Sugarcane'),
('Banana'),
('Potato'),
('Tomato'),
('Onion')
ON CONFLICT DO NOTHING;

-- Add some sample symptoms  
INSERT INTO public.symptoms (name) VALUES
('Yellowing leaves'),
('Black spots'),
('Wilting'),
('Stunted growth'),
('Brown patches'),
('Holes in leaves')
ON CONFLICT DO NOTHING;

-- Add some sample diseases
INSERT INTO public.diseases (name, solution) VALUES
('Leaf Blight', 'Apply fungicide spray every 7 days'),
('Root Rot', 'Improve drainage and reduce watering'),
('Bacterial Wilt', 'Remove infected plants and disinfect soil')
ON CONFLICT DO NOTHING;

-- Add some sample crop diseases
INSERT INTO public.crop_diseases (name, description) VALUES
('Rice Blast', 'Fungal disease causing diamond-shaped lesions'),
('Cotton Bollworm', 'Pest causing damage to cotton bolls'),
('Tomato Late Blight', 'Fungal disease causing dark spots on leaves')
ON CONFLICT DO NOTHING;

-- Add some sample pesticides
INSERT INTO public.pesticides (name, dosage) VALUES
('Carbendazim', '1-2 ml per liter of water'),
('Imidacloprid', '0.5 ml per liter of water'),
('Copper Oxychloride', '3-4 grams per liter of water')
ON CONFLICT DO NOTHING;