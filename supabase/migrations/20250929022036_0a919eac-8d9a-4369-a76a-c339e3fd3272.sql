-- Add sample data for location_symptoms (animal disease detection)
INSERT INTO public.location_symptoms (location_id, symptom_id, disease_id) VALUES
(1, 1, 1), (1, 2, 1), (1, 3, 1), -- Bangalore Urban - Fever, Milk drop, Nasal discharge -> Disease 1
(2, 4, 2), (2, 5, 2), (2, 6, 2), -- Mandya - Diarrhea, Dehydration, Loss of appetite -> Disease 2
(3, 7, 3), (3, 8, 3), (3, 9, 3), -- Mysuru - Cough, Conjunctivitis, Skin lesions -> Disease 3
(4, 27, 1), (4, 28, 1), (4, 29, 1), -- Belagavi - Yellowing leaves, Black spots, Wilting -> Disease 1
(5, 30, 2), (5, 31, 2), (5, 32, 2) -- Dharwad - Stunted growth, Brown patches, Holes in leaves -> Disease 2
ON CONFLICT DO NOTHING;

-- Add sample data for crop_treatment (crop disease detection)
INSERT INTO public.crop_treatment (location_id, crop_id, disease_id, pesticide_id) VALUES
(1, 1, 1, 1), -- Bangalore Urban + Paddy -> Disease 1 + Pesticide 1
(1, 2, 2, 2), -- Bangalore Urban + Sugarcane -> Disease 2 + Pesticide 2
(2, 1, 1, 1), -- Mandya + Paddy -> Disease 1 + Pesticide 1
(2, 2, 3, 3), -- Mandya + Sugarcane -> Disease 3 + Pesticide 3
(2, 3, 2, 2), -- Mandya + Cotton -> Disease 2 + Pesticide 2
(3, 1, 1, 1), -- Mysuru + Paddy -> Disease 1 + Pesticide 1
(3, 4, 2, 2), -- Mysuru + Maize -> Disease 2 + Pesticide 2
(4, 3, 3, 3), -- Belagavi + Cotton -> Disease 3 + Pesticide 3
(5, 1, 1, 1), -- Dharwad + Paddy -> Disease 1 + Pesticide 1
(5, 2, 2, 2)  -- Dharwad + Sugarcane -> Disease 2 + Pesticide 2
ON CONFLICT DO NOTHING;