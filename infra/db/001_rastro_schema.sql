CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS profiles (
  id text PRIMARY KEY,
  display_name text NOT NULL,
  avatar_url text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trail_versions (
  id text PRIMARY KEY,
  parent_version_id text REFERENCES trail_versions(id),
  author_id text NOT NULL REFERENCES profiles(id),
  name text NOT NULL,
  description text NOT NULL,
  region text,
  visibility text NOT NULL CHECK (visibility IN ('public', 'private', 'group')),
  geometry_json jsonb NOT NULL,
  geom geometry(LineString, 4326),
  estimated_duration_min integer NOT NULL CHECK (estimated_duration_min >= 0),
  estimated_duration_max integer NOT NULL CHECK (estimated_duration_max >= estimated_duration_min),
  general_difficulty text NOT NULL CHECK (general_difficulty IN ('easy', 'moderate', 'difficult', 'extreme')),
  vehicle_ratings jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL CHECK (status IN ('unknown', 'open', 'partially_blocked', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS trail_versions_geom_idx ON trail_versions USING gist (geom);
CREATE INDEX IF NOT EXISTS trail_versions_public_idx ON trail_versions (visibility, updated_at DESC);

CREATE TABLE IF NOT EXISTS points_of_interest (
  id text PRIMARY KEY,
  trail_id text NOT NULL REFERENCES trail_versions(id) ON DELETE CASCADE,
  author_id text NOT NULL REFERENCES profiles(id),
  type text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  coordinate jsonb NOT NULL,
  verified_at timestamptz
);

CREATE TABLE IF NOT EXISTS activities (
  id text PRIMARY KEY,
  author_id text NOT NULL REFERENCES profiles(id),
  trail_id text REFERENCES trail_versions(id),
  status text NOT NULL,
  started_at timestamptz NOT NULL,
  finished_at timestamptz,
  distance_km numeric NOT NULL DEFAULT 0,
  total_seconds integer NOT NULL DEFAULT 0,
  samples jsonb NOT NULL DEFAULT '[]'::jsonb,
  visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'group'))
);

CREATE TABLE IF NOT EXISTS activity_reports (
  id text PRIMARY KEY,
  activity_id text NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  author_id text NOT NULL REFERENCES profiles(id),
  title text NOT NULL,
  description text NOT NULL,
  visibility text NOT NULL CHECK (visibility IN ('public', 'private', 'group')),
  created_at timestamptz NOT NULL DEFAULT now()
);
