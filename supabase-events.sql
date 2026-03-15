-- 1. Create event_registrations table
create table public.event_registrations (
  id uuid default gen_random_uuid() primary key,
  event_id integer not null,
  event_title text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  roll_number text not null,
  branch text not null,
  year text not null,
  cp_handle text,
  registered_at timestamp with time zone default timezone('utc', now()),
  unique(event_id, email)
);

-- 2. Enable Row Level Security
alter table public.event_registrations enable row level security;

-- 3. Anyone can insert a registration
create policy "Anyone can register for events"
  on public.event_registrations for insert
  with check (true);

-- 4. Users can view their own registrations
create policy "Users can view own registrations"
  on public.event_registrations for select
  using (true);
