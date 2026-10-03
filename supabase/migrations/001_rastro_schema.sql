create extension if not exists postgis;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists public.trail_versions (
  id text primary key,
  parent_version_id text references public.trail_versions(id),
  author_id uuid not null references auth.users(id),
  name text not null,
  description text not null,
  region text,
  visibility text not null check (visibility in ('public', 'private', 'group')),
  geometry_json jsonb not null,
  geom geometry(LineString, 4326),
  estimated_duration_min integer not null check (estimated_duration_min >= 0),
  estimated_duration_max integer not null check (estimated_duration_max >= estimated_duration_min),
  general_difficulty text not null check (general_difficulty in ('easy', 'moderate', 'difficult', 'extreme')),
  vehicle_ratings jsonb not null default '[]'::jsonb,
  status text not null check (status in ('unknown', 'open', 'partially_blocked', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trail_versions_geom_idx on public.trail_versions using gist (geom);

create table if not exists public.points_of_interest (
  id text primary key,
  trail_id text not null references public.trail_versions(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  type text not null,
  name text not null,
  description text not null,
  coordinate jsonb not null,
  verified_at timestamptz
);

create table if not exists public.activities (
  id text primary key,
  author_id uuid not null references auth.users(id),
  trail_id text references public.trail_versions(id),
  status text not null,
  started_at timestamptz not null,
  finished_at timestamptz,
  distance_km numeric not null default 0,
  total_seconds integer not null default 0,
  samples jsonb not null default '[]'::jsonb,
  visibility text not null default 'private' check (visibility in ('public', 'private', 'group'))
);

create table if not exists public.activity_reports (
  id text primary key,
  activity_id text not null references public.activities(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  title text not null,
  description text not null,
  visibility text not null check (visibility in ('public', 'private', 'group')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.trail_versions enable row level security;
alter table public.points_of_interest enable row level security;
alter table public.activities enable row level security;
alter table public.activity_reports enable row level security;

create policy "public trails are readable" on public.trail_versions
  for select using (visibility = 'public' or author_id = (select auth.uid()));
create policy "users create their trails" on public.trail_versions
  for insert with check (author_id = (select auth.uid()));
create policy "owners update their trails" on public.trail_versions
  for update using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));

create policy "points follow trail visibility" on public.points_of_interest
  for select using (
    exists (
      select 1 from public.trail_versions trail
      where trail.id = points_of_interest.trail_id
        and (trail.visibility = 'public' or trail.author_id = (select auth.uid()))
    )
  );
create policy "users create their points" on public.points_of_interest
  for insert with check (author_id = (select auth.uid()));

create policy "users read their activities" on public.activities
  for select using (author_id = (select auth.uid()) or visibility = 'public');
create policy "users create their activities" on public.activities
  for insert with check (author_id = (select auth.uid()));
create policy "users update their activities" on public.activities
  for update using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));

create policy "published reports are readable" on public.activity_reports
  for select using (visibility = 'public' or author_id = (select auth.uid()));
create policy "users publish their reports" on public.activity_reports
  for insert with check (author_id = (select auth.uid()));
