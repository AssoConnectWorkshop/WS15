-- Academy leads: prospects who fill the lead capture form
create table if not exists academy_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  association_name text,
  role text,
  created_at timestamptz not null default now()
);

-- Academy progress: authenticated users (clients via SSO)
create table if not exists academy_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed_articles text[] not null default '{}',
  unlocked_badges text[] not null default '{}',
  quiz_results jsonb not null default '{}',
  earned_quiz_xp jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- RLS
alter table academy_leads enable row level security;
alter table academy_progress enable row level security;

-- Leads: insert-only for anon (lead capture), read/write for authenticated owner
create policy "Anyone can create a lead" on academy_leads for insert with check (true);
create policy "Users can read own progress" on academy_progress for select using (auth.uid() = user_id);
create policy "Users can upsert own progress" on academy_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on academy_progress for update using (auth.uid() = user_id);
