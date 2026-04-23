-- ============================================================
-- ParisLineOne (PL1) — Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Metro Line 1 stations (static seed data)
CREATE TABLE IF NOT EXISTS metro_stations (
  id       SERIAL PRIMARY KEY,
  name     TEXT NOT NULL,
  name_en  TEXT,
  lat      DOUBLE PRECISION NOT NULL,
  lng      DOUBLE PRECISION NOT NULL
);

-- Properties
CREATE TABLE IF NOT EXISTS properties (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now(),

  title               TEXT NOT NULL,
  title_en            TEXT,
  description         TEXT,
  description_en      TEXT,
  price               INTEGER NOT NULL,
  price_type          TEXT CHECK (price_type IN ('rent','sale')) DEFAULT 'rent',
  property_type       TEXT CHECK (property_type IN ('apartment','house','studio','commercial')),
  surface_m2          INTEGER,
  rooms               INTEGER,
  floor               INTEGER,
  furnished           BOOLEAN DEFAULT false,

  address             TEXT NOT NULL,
  lat                 DOUBLE PRECISION NOT NULL,
  lng                 DOUBLE PRECISION NOT NULL,
  nearest_station_id  INTEGER REFERENCES metro_stations(id),
  walk_minutes        INTEGER,

  images              TEXT[] DEFAULT '{}',

  contact_name        TEXT NOT NULL,
  contact_email       TEXT NOT NULL,
  contact_phone       TEXT,

  status              TEXT CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  admin_note          TEXT
);

CREATE INDEX IF NOT EXISTS idx_properties_station ON properties(nearest_station_id);
CREATE INDEX IF NOT EXISTS idx_properties_status  ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);

-- Admins table (links to Supabase Auth users)
CREATE TABLE IF NOT EXISTS admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE metro_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Metro stations: public read
CREATE POLICY "public_read_stations"
  ON metro_stations FOR SELECT USING (true);

-- Properties: public can read approved
CREATE POLICY "public_read_approved"
  ON properties FOR SELECT USING (status = 'approved');

-- Properties: anyone can insert (pending by default, enforced by check constraint)
CREATE POLICY "public_insert_pending"
  ON properties FOR INSERT WITH CHECK (status = 'pending');

-- Properties: admins can do everything
CREATE POLICY "admin_all_properties"
  ON properties FOR ALL
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- Admins: admins can read their own record
CREATE POLICY "admin_read_self"
  ON admins FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================
-- Seed: Line 1 stations
-- ============================================================
INSERT INTO metro_stations (id, name, name_en, lat, lng) VALUES
  (1,  'La Défense (Grande Arche)',       'La Défense (Grande Arche)',       48.8918, 2.2387),
  (2,  'Esplanade de La Défense',         'La Défense Esplanade',            48.8889, 2.2484),
  (3,  'Pont de Neuilly',                 'Neuilly Bridge',                  48.8848, 2.2588),
  (4,  'Les Sablons',                     'Les Sablons',                     48.8783, 2.2724),
  (5,  'Porte Maillot',                   'Porte Maillot',                   48.8780, 2.2838),
  (6,  'Argentine',                       'Argentine',                       48.8752, 2.2934),
  (7,  'Charles de Gaulle–Étoile',        'Charles de Gaulle–Étoile',        48.8738, 2.2950),
  (8,  'George V',                        'George V',                        48.8726, 2.3022),
  (9,  'Franklin D. Roosevelt',           'Franklin D. Roosevelt',           48.8697, 2.3085),
  (10, 'Champs-Élysées–Clemenceau',       'Champs-Élysées–Clemenceau',       48.8668, 2.3133),
  (11, 'Concorde',                        'Concorde',                        48.8656, 2.3213),
  (12, 'Tuileries',                       'Tuileries',                       48.8637, 2.3322),
  (13, 'Palais Royal–Musée du Louvre',    'Palais Royal–Louvre Museum',      48.8638, 2.3364),
  (25, 'Louvre–Rivoli',                   'Louvre–Rivoli',                   48.8607, 2.3417),
  (14, 'Châtelet',                        'Châtelet',                        48.8602, 2.3472),
  (15, 'Hôtel de Ville',                  'City Hall',                       48.8572, 2.3519),
  (16, 'Saint-Paul (Le Marais)',           'Saint-Paul (Le Marais)',          48.8548, 2.3598),
  (17, 'Bastille',                        'Bastille',                        48.8533, 2.3694),
  (18, 'Gare de Lyon',                    'Gare de Lyon',                    48.8444, 2.3733),
  (19, 'Reuilly–Diderot',                 'Reuilly–Diderot',                 48.8483, 2.3866),
  (20, 'Nation',                          'Nation',                          48.8484, 2.3960),
  (21, 'Bérault',                         'Bérault',                         48.8445, 2.4076),
  (22, 'Saint-Mandé',                     'Saint-Mandé',                     48.8438, 2.4190),
  (23, 'Porte de Vincennes',              'Porte de Vincennes',              48.8441, 2.4288),
  (24, 'Château de Vincennes',            'Château de Vincennes',            48.8446, 2.4391)
ON CONFLICT (id) DO NOTHING;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
