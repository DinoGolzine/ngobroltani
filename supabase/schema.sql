-- NgobrolTani - jalankan seluruh file ini di Supabase > SQL Editor

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Petani Baru',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), split_part(new.email, '@', 1)));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  forum text not null check (forum in ('tips-merawat-tanaman','cara-memberi-pupuk','mengatasi-hama','mengatasi-tanaman-layu','cara-memilih-bibit')),
  title text not null check (char_length(title) between 5 and 150),
  body text not null check (char_length(body) between 10 and 5000),
  image_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 5000),
  is_best boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists questions_forum_idx on public.questions (forum, created_at desc);
create index if not exists answers_question_idx on public.answers (question_id, created_at);

alter table public.profiles  enable row level security;
alter table public.questions enable row level security;
alter table public.answers   enable row level security;

create policy "profil terbaca semua" on public.profiles for select using (true);
create policy "ubah profil sendiri" on public.profiles for update using (auth.uid() = id);

create policy "pertanyaan terbaca semua" on public.questions for select using (true);
create policy "buat pertanyaan" on public.questions for insert to authenticated with check (auth.uid() = user_id);
create policy "hapus pertanyaan sendiri" on public.questions for delete to authenticated using (auth.uid() = user_id);

create policy "jawaban terbaca semua" on public.answers for select using (true);
create policy "buat jawaban" on public.answers for insert to authenticated with check (auth.uid() = user_id);
create policy "hapus jawaban sendiri" on public.answers for delete to authenticated using (auth.uid() = user_id);
create policy "penanya menandai jawaban terbaik" on public.answers for update to authenticated
  using (exists (select 1 from public.questions q where q.id = question_id and q.user_id = auth.uid()))
  with check (exists (select 1 from public.questions q where q.id = question_id and q.user_id = auth.uid()));

-- Storage: bucket publik untuk foto pertanyaan
insert into storage.buckets (id, name, public) values ('question-images', 'question-images', true)
on conflict (id) do nothing;

create policy "foto terbaca semua" on storage.objects for select using (bucket_id = 'question-images');
create policy "upload foto ke folder sendiri" on storage.objects for insert to authenticated
  with check (bucket_id = 'question-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "hapus foto sendiri" on storage.objects for delete to authenticated
  using (bucket_id = 'question-images' and (storage.foldername(name))[1] = auth.uid()::text);
