
-- Create shipping table to store wilaya, commune, and pricing data
CREATE TABLE public.shipping_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wilaya TEXT NOT NULL UNIQUE,
  base_price NUMERIC NOT NULL DEFAULT 0,
  communes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial shipping data from the JSON file
INSERT INTO public.shipping_data (wilaya, base_price, communes) VALUES
('Adrar', 800, ARRAY['Adrar', 'Tamest', 'Charouine', 'Reggane', 'Inzghmir', 'Tit', 'Ksar Kaddour', 'Tsabit', 'Timimoun', 'Ouled Said', 'Zaouiet Kounta', 'Aoulef', 'Timiaouine', 'Tinerkouk', 'Deldoul', 'Sali', 'Akabli', 'Metarfa', 'Ouled Aissa', 'Bouda', 'Aougrout', 'Talmine', 'Bordj Badji Mokhtar', 'Sebaa', 'Ouled Khodeir', 'Timekten', 'Fenoughil', 'Tamantit', 'Reggane']),
('Chlef', 500, ARRAY['Chlef', 'Ténès', 'Benairia', 'El Karimia', 'Tadjena', 'Taougrite', 'Beni Haoua', 'Sobha', 'Harchoun', 'Ouled Fares', 'Sidi Akkacha', 'Boukadir', 'Beni Rached', 'Talassa', 'Herenfa', 'Oued Goussine', 'Dahra', 'Ouled Abbes', 'Sendjas', 'Zeboudja', 'Oued Sly', 'Abou El Hassen', 'El Marsa', 'Chettia', 'Sidi Abderrahmane', 'Moussadek', 'El Hadjadj', 'Labiod Medjadja', 'Oued Fodda', 'Ouled Ben Abdelkader', 'Bouzghaia', 'Ain Merane', 'Oum Drou', 'Breira', 'Beni Bouattab']),
('Laghouat', 600, ARRAY['Laghouat', 'Ksar El Hirane', 'Bennasser Benchohra', 'Sidi Makhlouf', 'Hassi Delaa', 'Hassi RMel', 'Ain Madhi', 'Tadjmout', 'Kheneg', 'Gueltat Sidi Saad', 'Aflou', 'El Beidh', 'Brida', 'El Ghicha', 'El Houaita', 'Sebgag', 'Taouila', 'Tadjrouna', 'Ain Sidi Ali', 'Benacer Benchohra', 'Sidi Bouzid', 'El Assafia', 'Oued Morra', 'Hadj Mechri']),
('Oum El Bouaghi', 450, ARRAY['Oum El Bouaghi', 'Ain Beida', 'Ain MLila', 'Behir Chergui', 'El Belkhir', 'Ksar Sbahi', 'Oued Nini', 'Dhala', 'Ain Babouche', 'Berriche', 'Ouled Hamla', 'Fkirina', 'Souk Naamane', 'Zorg', 'El Djazia', 'Ain Kercha', 'Hanchir Toumghani', 'El Harmilia', 'Rahia', 'Bir Chouhada', 'Ouled Zouai', 'Sigus', 'El Fedjoudj Boughrara Saoudi', 'Ouled Gacem', 'El Amiria', 'Ain Diss', 'Ain Fakroun', 'Meskiana', 'Canrobert']),
('Batna', 450, ARRAY['Batna', 'Ghassira', 'Maafa', 'Merouana', 'Seriana', 'Menaa', 'El Madher', 'Tazoult', 'NGaous', 'Guigba', 'Inoughissen', 'Ouyoun El Assafir', 'Djerma', 'Bitam', 'Abdelkader', 'Arris', 'Kimmel', 'Tilatou', 'Ain Djasser', 'Ouled Sellam', 'Tigherghar', 'Ain Yagout', 'Fesdis', 'Sefiane', 'Rahbat', 'Tighanimine', 'Lemsane', 'Ksar Belezma', 'Seggana', 'Ichmoul', 'Foum Toub', 'Beni Foudhala El Hakania', 'Oued El Ma', 'Talkhamt', 'Bouzina', 'Chemora', 'Oued Chaaba', 'Taxlent', 'Gosbat', 'Ouled Fadel', 'Timgad', 'Ras El Aioun', 'Chir', 'Ouled Aouf', 'Boumagueur', 'Barika', 'Djezzar', 'Tkout', 'Ain Touta', 'Hidoussa', 'Teniet El Abed', 'Oued Taga', 'Ouled Si Slimane', 'Zanat El Beida', 'Mdoukal', 'Laksar', 'Lemsen', 'Ksar Belezma', 'El Hassi']),
('Béjaïa', 400, ARRAY['Béjaïa', 'Amizour', 'Ferraoun', 'Taourirt Ighil', 'Chellata', 'Tamokra', 'Timzrit', 'Souk El Tenine', 'MCisna', 'Tinebdar', 'Tichy', 'Semaoun', 'Kendira', 'Tifra', 'Ighram', 'Amalou', 'Ighil Ali', 'Fenaia Ilmaten', 'Toudja', 'Darguina', 'Sidi Ayad', 'Aokas', 'Beni Djellil', 'Adekar', 'Akbou', 'Seddouk', 'Tazmalt', 'Ait Rizine', 'Chemini', 'Souk Oufella', 'Taskriout', 'Tibane', 'Tala Hamza', 'Barbacha', 'Beni Ksila', 'Ouzellaguen', 'Bouhamza', 'Beni Mellikeche', 'Sidi Aich', 'El Kseur', 'Melbou', 'Akfadou', 'Leflaye', 'Kherrata', 'Draa Kaid', 'Tamridjet', 'Ait Smail', 'Boukhelifa', 'Tizi Nberber', 'Beni Maouche', 'Oued Ghir', 'Boudjellil']),
('Biskra', 500, ARRAY['Biskra', 'Sidi Okba', 'Chetma', 'Foughala', 'Branis', 'Zeribet El Oued', 'Elkantara', 'Ain Naga', 'Khenguet Sidi Nadji', 'Lioua', 'Mchouneche', 'El Haouch', 'Ain Zaatout', 'El Feidh', 'Ras El Miaad', 'Sidi Khaled', 'Tolga', 'Lghrous', 'Lichana', 'Ourlal', 'Mlili', 'Meziraa', 'Bouchagroun', 'Mekhadma', 'El Ghrous', 'El Kantara', 'Djemorah', 'Ouled Djellal', 'Besbes', 'Chaiba', 'Doucen', 'Umm Ali', 'Sghira']),
('Béchar', 700, ARRAY['Béchar', 'Kénadsa', 'Lahmar', 'Beni Ounif', 'Timoudi', 'Ouled Khodeir', 'Mechraa Houari Boumediene', 'Boukais', 'Mogheul', 'Tabelbala', 'Igli', 'Taghit', 'El Ouata', 'Kerzaz', 'Ksabi', 'Meridja', 'Talmine', 'Beni Abbes', 'Tamtert', 'Ouled Khoudir', 'Erg Ferradj']),
('Blida', 350, ARRAY['Blida', 'Chréa', 'Boufarik', 'Larbaa', 'Oued Alleug', 'Bougara', 'Ouled Yaich', 'Chiffa', 'Hammam Elouane', 'Ben Khelil', 'Soumaa', 'Mouzaia', 'El Affroun', 'Chebli', 'Guerrouaou', 'Ain Romana', 'Djebabra', 'Beni Mered', 'Bouinan', 'Oued El Alleug', 'Beni Tamou', 'Souhane', 'Ouled Selama', 'Bougara', 'Meftah']),
('Bouira', 400, ARRAY['Bouira', 'El Asnam', 'Kadiria', 'Sour El Ghouzlane', 'Ahl El Ksar', 'Guerrouma', 'Souk El Khemis', 'Haizer', 'Lakhdaria', 'Maala', 'Chorfa', 'Dirah', 'Saharidj', 'Ain Bessem', 'Bir Ghbalou', 'Khabouzia', 'Bordj Okhriss', 'El Hachimia', 'Raouraoua', 'Mezdour', 'Taghzout', 'Ridane', 'Djebahia', 'Aghbalou', 'Taguedit', 'Ain El Hadjar', 'Hadjera Zerga', 'Ain Laloui', 'Boukram', 'Bouderbala', 'El Adjiba', 'Hanif', 'MChedallah', 'El Mokrani', 'Dechmia', 'Aomar', 'Bechloul', 'Bouiche', 'El Hakimia', 'Ain Turk', 'Oued El Berdi', 'Zbarbar', 'Ain El Hadjar', 'Mamora', 'Ain Bessem']);

-- Enable Row Level Security (optional - can be disabled for public access)
-- ALTER TABLE public.shipping_data ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since shipping data should be publicly viewable)
-- CREATE POLICY "Allow public read access to shipping data" 
--   ON public.shipping_data 
--   FOR SELECT 
--   USING (true);

-- Create policy for authenticated users to modify shipping data (admin only)
-- CREATE POLICY "Allow authenticated users to modify shipping data" 
--   ON public.shipping_data 
--   FOR ALL 
--   USING (auth.role() = 'authenticated');
