-- 1. Create contact_messages table
create table public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  sent_at timestamp with time zone default timezone('utc', now())
);

-- 2. Enable Row Level Security
alter table public.contact_messages enable row level security;

-- 3. Anyone can insert a message
create policy "Anyone can send a message"
  on public.contact_messages for insert
  with check (true);
