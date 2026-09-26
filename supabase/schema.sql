-- ============================================================
-- Skema database untuk "Tanya Tanaman"
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor
-- (Project Anda > SQL Editor > New query > paste > Run)
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Kategori pertanyaan
-- ------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text
);

insert into public.categories (slug, name, description) values
  ('tips-merawat-tanaman', 'Tips Merawat Tanaman', 'Perawatan tanaman sehari-hari: kapan disiram, kebutuhan cahaya, cara membersihkan daun, dan menjaga tanaman tetap sehat.'),
  ('cara-memberi-pupuk', 'Cara Memberi Pupuk', 'Waktu dan cara memberi pupuk yang benar, takaran agar tidak berlebihan, dan contoh pupuk yang biasa digunakan.'),
  ('mengatasi-hama', 'Mengatasi Hama', 'Masalah tanaman akibat hama: daun berlubang, ada ulat atau serangga, daun rusak, dan cara sederhana mengatasinya.'),
  ('mengatasi-tanaman-layu', 'Mengatasi Tanaman Layu', 'Penyebab tanaman tiba-tiba layu — kurang air, kebanyakan air, terlalu panas, atau masalah akar — dan cara mengatasinya.'),
  ('cara-memilih-bibit', 'Cara Memilih Bibit', 'Cara memilih bibit yang sehat: melihat kondisi daun, memeriksa batang, dan menghindari bibit yang rusak atau layu.')
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- Profil publik (mengikuti auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);

-- Otomatis buat baris profil setiap ada user baru daftar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- Pertanyaan
-- ------------------------------------------------------------
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  title text not null,
  description text not null,
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists questions_category_idx on public.questions (category_id);
create index if not exists questions_created_at_idx on public.questions (created_at desc);

-- ------------------------------------------------------------
-- Jawaban
-- ------------------------------------------------------------
create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists answers_question_idx on public.answers (question_id);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;

-- Kategori: bisa dibaca semua orang
drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

-- Profil: bisa dibaca semua orang, hanya pemilik yang bisa update
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Pertanyaan: bisa dibaca semua orang, hanya user login yang bisa insert,
-- hanya pemilik yang bisa update/delete
drop policy if exists "Questions are viewable by everyone" on public.questions;
create policy "Questions are viewable by everyone"
  on public.questions for select
  using (true);

drop policy if exists "Authenticated users can insert questions" on public.questions;
create policy "Authenticated users can insert questions"
  on public.questions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Owners can update their questions" on public.questions;
create policy "Owners can update their questions"
  on public.questions for update
  using (auth.uid() = user_id);

drop policy if exists "Owners can delete their questions" on public.questions;
create policy "Owners can delete their questions"
  on public.questions for delete
  using (auth.uid() = user_id);

-- Jawaban: bisa dibaca semua orang, hanya user login yang bisa insert,
-- hanya pemilik yang bisa update/delete
drop policy if exists "Answers are viewable by everyone" on public.answers;
create policy "Answers are viewable by everyone"
  on public.answers for select
  using (true);

drop policy if exists "Authenticated users can insert answers" on public.answers;
create policy "Authenticated users can insert answers"
  on public.answers for insert
  with check (auth.uid() = user_id);

drop policy if exists "Owners can update their answers" on public.answers;
create policy "Owners can update their answers"
  on public.answers for update
  using (auth.uid() = user_id);

drop policy if exists "Owners can delete their answers" on public.answers;
create policy "Owners can delete their answers"
  on public.answers for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Storage: bucket untuk foto pertanyaan
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('question-images', 'question-images', true)
on conflict (id) do nothing;

drop policy if exists "Question images are publicly accessible" on storage.objects;
create policy "Question images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'question-images');

drop policy if exists "Authenticated users can upload question images" on storage.objects;
create policy "Authenticated users can upload question images"
  on storage.objects for insert
  with check (bucket_id = 'question-images' and auth.role() = 'authenticated');

drop policy if exists "Owners can delete their question images" on storage.objects;
create policy "Owners can delete their question images"
  on storage.objects for delete
  using (bucket_id = 'question-images' and auth.uid()::text = (storage.foldername(name))[1]);
