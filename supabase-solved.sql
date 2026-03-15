-- 1. Create solved_problems table
create table public.solved_problems (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  problem_id integer not null,
  solved_at timestamp with time zone default timezone('utc', now()),
  unique(user_id, problem_id)
);

-- 2. Enable Row Level Security
alter table public.solved_problems enable row level security;

-- 3. Users can read their own solved problems
create policy "Users can view own solved problems"
  on public.solved_problems for select
  using (auth.uid() = user_id);

-- 4. Users can insert their own solved problems
create policy "Users can insert own solved problems"
  on public.solved_problems for insert
  with check (auth.uid() = user_id);

-- 5. Users can delete their own solved problems (for un-solving)
create policy "Users can delete own solved problems"
  on public.solved_problems for delete
  using (auth.uid() = user_id);
