-- Furrix — généré depuis Furrix_Documentation_Technique.md
-- Appliquer avec : supabase db push

-- Vétérinaires de démonstration (Hauts-de-France)
insert into vets (name, spec, address, city, lat, lng, teleconsult, partner, rating) values
('Clinique Vétérinaire du Parc', 'Généraliste', '12 rue Nationale', 'Lille', 50.633, 3.058, true, true, 4.8),
('Cabinet Dr. Moreau', 'NAC & exotiques', '45 av. de la République', 'Roubaix', 50.690, 3.174, false, true, 4.6),
('VetCare Tourcoing', 'Chirurgie', '8 place Victor Hugo', 'Tourcoing', 50.723, 3.161, true, false, 4.5),
('Clinique des 3 Vallées', 'Généraliste', '22 rue de la Gare', 'Villeneuve-d''Ascq', 50.619, 3.131, true, true, 4.9);

-- Événement de démonstration
insert into events (title, date, location, species, max_participants, price) values
('Grande balade canine — Citadelle', now() + interval '10 days', 'Parc de la Citadelle, Lille', 'chien', 40, null);
