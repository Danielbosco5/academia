-- ============================================================
-- SCRIPT DE VERIFICAÇÃO E CRIAÇÃO DO BANCO DE DADOS
-- Academia GO - Sistema de Gestão de Academia SEDUC
-- Gerado em: 2026-02-10
-- ============================================================
-- Este script verifica se todas as tabelas, colunas, índices,
-- políticas RLS e dados iniciais existem no Supabase.
-- Se não existirem, cria automaticamente.
-- É SEGURO rodar múltiplas vezes (idempotente).
-- ============================================================

-- ============================================================
-- 1. EXTENSÕES NECESSÁRIAS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. TABELA: students (Alunos / Servidores)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.students (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cpf         TEXT NOT NULL,
  name        TEXT NOT NULL DEFAULT 'Sem Nome',
  department  TEXT DEFAULT '',
  phone       TEXT DEFAULT '',
  birth_date  TEXT DEFAULT '',
  age         INTEGER DEFAULT 0,
  gender      TEXT DEFAULT 'Masculino',
  blocked     BOOLEAN DEFAULT FALSE,
  on_waitlist BOOLEAN DEFAULT FALSE,
  modality    TEXT DEFAULT 'Academia',
  training_days TEXT DEFAULT '',
  training_time TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar colunas que possam estar faltando (caso a tabela já exista)
DO $$
BEGIN
  -- cpf
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='cpf') THEN
    ALTER TABLE public.students ADD COLUMN cpf TEXT NOT NULL DEFAULT '';
  END IF;
  -- name
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='name') THEN
    ALTER TABLE public.students ADD COLUMN name TEXT NOT NULL DEFAULT 'Sem Nome';
  END IF;
  -- department
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='department') THEN
    ALTER TABLE public.students ADD COLUMN department TEXT DEFAULT '';
  END IF;
  -- phone
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='phone') THEN
    ALTER TABLE public.students ADD COLUMN phone TEXT DEFAULT '';
  END IF;
  -- birth_date
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='birth_date') THEN
    ALTER TABLE public.students ADD COLUMN birth_date TEXT DEFAULT '';
  END IF;
  -- age
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='age') THEN
    ALTER TABLE public.students ADD COLUMN age INTEGER DEFAULT 0;
  END IF;
  -- gender
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='gender') THEN
    ALTER TABLE public.students ADD COLUMN gender TEXT DEFAULT 'Masculino';
  END IF;
  -- blocked
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='blocked') THEN
    ALTER TABLE public.students ADD COLUMN blocked BOOLEAN DEFAULT FALSE;
  END IF;
  -- on_waitlist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='on_waitlist') THEN
    ALTER TABLE public.students ADD COLUMN on_waitlist BOOLEAN DEFAULT FALSE;
  END IF;
  -- modality
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='modality') THEN
    ALTER TABLE public.students ADD COLUMN modality TEXT DEFAULT 'Academia';
  END IF;
  -- training_days
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='training_days') THEN
    ALTER TABLE public.students ADD COLUMN training_days TEXT DEFAULT '';
  END IF;
  -- training_time (armazena horário + turma no formato "07h | Turma A")
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='training_time') THEN
    ALTER TABLE public.students ADD COLUMN training_time TEXT DEFAULT '';
  END IF;
  -- created_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='created_at') THEN
    ALTER TABLE public.students ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- ============================================================
-- 3. TABELA: attendance_records (Registros de Frequência)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_cpf TEXT NOT NULL,
  timestamp   TIMESTAMPTZ DEFAULT NOW(),
  hour        TEXT DEFAULT '',
  photo_url   TEXT
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='attendance_records' AND column_name='student_cpf') THEN
    ALTER TABLE public.attendance_records ADD COLUMN student_cpf TEXT NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='attendance_records' AND column_name='timestamp') THEN
    ALTER TABLE public.attendance_records ADD COLUMN "timestamp" TIMESTAMPTZ DEFAULT NOW();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='attendance_records' AND column_name='hour') THEN
    ALTER TABLE public.attendance_records ADD COLUMN hour TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='attendance_records' AND column_name='photo_url') THEN
    ALTER TABLE public.attendance_records ADD COLUMN photo_url TEXT;
  END IF;
END $$;

-- ============================================================
-- 4. TABELA: documents (Documentos Gerais e de Alunos)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT DEFAULT '',
  file_name   TEXT DEFAULT '',
  upload_date TEXT DEFAULT '',
  file_url    TEXT,
  file_type   TEXT,
  student_id  TEXT
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='documents' AND column_name='title') THEN
    ALTER TABLE public.documents ADD COLUMN title TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='documents' AND column_name='file_name') THEN
    ALTER TABLE public.documents ADD COLUMN file_name TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='documents' AND column_name='upload_date') THEN
    ALTER TABLE public.documents ADD COLUMN upload_date TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='documents' AND column_name='file_url') THEN
    ALTER TABLE public.documents ADD COLUMN file_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='documents' AND column_name='file_type') THEN
    ALTER TABLE public.documents ADD COLUMN file_type TEXT;
  END IF;
  -- student_id pode ser NULL (docs gerais) ou ter valor (docs de aluno específico)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='documents' AND column_name='student_id') THEN
    ALTER TABLE public.documents ADD COLUMN student_id TEXT;
  END IF;
END $$;

-- ============================================================
-- 5. TABELA: system_users (Usuários do Sistema - Login)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.system_users (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name     TEXT NOT NULL,
  email    TEXT NOT NULL,
  cpf      TEXT DEFAULT '',
  password TEXT DEFAULT '123456',
  role     TEXT DEFAULT 'Professor',
  active   BOOLEAN DEFAULT TRUE
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='system_users' AND column_name='name') THEN
    ALTER TABLE public.system_users ADD COLUMN name TEXT NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='system_users' AND column_name='email') THEN
    ALTER TABLE public.system_users ADD COLUMN email TEXT NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='system_users' AND column_name='cpf') THEN
    ALTER TABLE public.system_users ADD COLUMN cpf TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='system_users' AND column_name='password') THEN
    ALTER TABLE public.system_users ADD COLUMN password TEXT DEFAULT '123456';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='system_users' AND column_name='role') THEN
    ALTER TABLE public.system_users ADD COLUMN role TEXT DEFAULT 'Professor';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='system_users' AND column_name='active') THEN
    ALTER TABLE public.system_users ADD COLUMN active BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- ============================================================
-- 6. ÍNDICES PARA PERFORMANCE
-- ============================================================

-- students
CREATE INDEX IF NOT EXISTS idx_students_cpf ON public.students (cpf);
CREATE INDEX IF NOT EXISTS idx_students_modality ON public.students (modality);
CREATE INDEX IF NOT EXISTS idx_students_on_waitlist ON public.students (on_waitlist);
CREATE INDEX IF NOT EXISTS idx_students_blocked ON public.students (blocked);
CREATE INDEX IF NOT EXISTS idx_students_name ON public.students (name);

-- attendance_records  
CREATE INDEX IF NOT EXISTS idx_attendance_student_cpf ON public.attendance_records (student_cpf);
CREATE INDEX IF NOT EXISTS idx_attendance_timestamp ON public.attendance_records ("timestamp");

-- documents
CREATE INDEX IF NOT EXISTS idx_documents_student_id ON public.documents (student_id);
CREATE INDEX IF NOT EXISTS idx_documents_upload_date ON public.documents (upload_date);

-- system_users
CREATE INDEX IF NOT EXISTS idx_system_users_email ON public.system_users (email);
CREATE INDEX IF NOT EXISTS idx_system_users_active ON public.system_users (active);

-- ============================================================
-- 6.1 CONSTRAINTS ÚNICOS
-- ============================================================
-- E-mail único em system_users (evita login quebrado com duplicatas)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'system_users_email_unique'
  ) THEN
    ALTER TABLE public.system_users ADD CONSTRAINT system_users_email_unique UNIQUE (email);
  END IF;
EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'Existem e-mails duplicados em system_users. Resolva manualmente antes de aplicar a constraint.';
END $$;

-- ============================================================
-- 7. POLÍTICAS DE SEGURANÇA (RLS)
-- ============================================================
-- O app usa supabaseAnonKey e autenticação própria (não Supabase Auth).
-- Precisamos habilitar RLS mas permitir acesso total via anon key
-- para que o app funcione corretamente.

-- students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'Allow full access to students') THEN
    CREATE POLICY "Allow full access to students" ON public.students
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- attendance_records
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'attendance_records' AND policyname = 'Allow full access to attendance_records') THEN
    CREATE POLICY "Allow full access to attendance_records" ON public.attendance_records
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Allow full access to documents') THEN
    CREATE POLICY "Allow full access to documents" ON public.documents
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- system_users
ALTER TABLE public.system_users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_users' AND policyname = 'Allow full access to system_users') THEN
    CREATE POLICY "Allow full access to system_users" ON public.system_users
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- 8. ADMINISTRADOR PADRÃO (caso nenhum usuário exista)
-- ============================================================
-- Cria um administrador padrão apenas se a tabela estiver vazia,
-- garantindo que exista ao menos um acesso ao sistema.

INSERT INTO public.system_users (name, email, cpf, password, role, active)
SELECT 
  'Administrador',
  'admin@academia.go.gov.br',
  '00000000000',
  '123456',
  'Administrador',
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.system_users WHERE role = 'Administrador'
);

-- ============================================================
-- 9. VERIFICAÇÃO FINAL - Relatório de Status
-- ============================================================
-- Rode esta parte separadamente no SQL Editor do Supabase para
-- ver o status de todas as tabelas e colunas.

DO $$
DECLARE
  v_table TEXT;
  v_count INTEGER;
  v_msg TEXT := '';
BEGIN
  -- Verificar tabela students
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='students') THEN
    SELECT COUNT(*) INTO v_count FROM public.students;
    v_msg := v_msg || '✅ students: OK (' || v_count || ' registros)' || E'\n';
  ELSE
    v_msg := v_msg || '❌ students: TABELA NÃO ENCONTRADA!' || E'\n';
  END IF;

  -- Verificar tabela attendance_records
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='attendance_records') THEN
    SELECT COUNT(*) INTO v_count FROM public.attendance_records;
    v_msg := v_msg || '✅ attendance_records: OK (' || v_count || ' registros)' || E'\n';
  ELSE
    v_msg := v_msg || '❌ attendance_records: TABELA NÃO ENCONTRADA!' || E'\n';
  END IF;

  -- Verificar tabela documents
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='documents') THEN
    SELECT COUNT(*) INTO v_count FROM public.documents;
    v_msg := v_msg || '✅ documents: OK (' || v_count || ' registros)' || E'\n';
  ELSE
    v_msg := v_msg || '❌ documents: TABELA NÃO ENCONTRADA!' || E'\n';
  END IF;

  -- Verificar tabela system_users
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='system_users') THEN
    SELECT COUNT(*) INTO v_count FROM public.system_users;
    v_msg := v_msg || '✅ system_users: OK (' || v_count || ' registros)' || E'\n';
  ELSE
    v_msg := v_msg || '❌ system_users: TABELA NÃO ENCONTRADA!' || E'\n';
  END IF;

  -- Verificar colunas críticas
  v_msg := v_msg || E'\n--- Colunas Críticas ---\n';
  
  -- students.training_time (armazena turma junto)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='training_time') THEN
    v_msg := v_msg || '✅ students.training_time: OK' || E'\n';
  ELSE
    v_msg := v_msg || '❌ students.training_time: FALTANDO!' || E'\n';
  END IF;

  -- students.on_waitlist
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='students' AND column_name='on_waitlist') THEN
    v_msg := v_msg || '✅ students.on_waitlist: OK' || E'\n';
  ELSE
    v_msg := v_msg || '❌ students.on_waitlist: FALTANDO!' || E'\n';
  END IF;

  -- documents.student_id
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='documents' AND column_name='student_id') THEN
    v_msg := v_msg || '✅ documents.student_id: OK' || E'\n';
  ELSE
    v_msg := v_msg || '❌ documents.student_id: FALTANDO!' || E'\n';
  END IF;

  -- system_users.password
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='system_users' AND column_name='password') THEN
    v_msg := v_msg || '✅ system_users.password: OK' || E'\n';
  ELSE
    v_msg := v_msg || '❌ system_users.password: FALTANDO!' || E'\n';
  END IF;

  -- attendance_records.photo_url
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='attendance_records' AND column_name='photo_url') THEN
    v_msg := v_msg || '✅ attendance_records.photo_url: OK' || E'\n';
  ELSE
    v_msg := v_msg || '❌ attendance_records.photo_url: FALTANDO!' || E'\n';
  END IF;

  -- Verificar RLS policies
  v_msg := v_msg || E'\n--- Políticas RLS ---\n';
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'students') THEN
    v_msg := v_msg || '✅ RLS students: Política configurada' || E'\n';
  ELSE
    v_msg := v_msg || '⚠️ RLS students: Sem política (pode bloquear acesso!)' || E'\n';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'attendance_records') THEN
    v_msg := v_msg || '✅ RLS attendance_records: Política configurada' || E'\n';
  ELSE
    v_msg := v_msg || '⚠️ RLS attendance_records: Sem política' || E'\n';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documents') THEN
    v_msg := v_msg || '✅ RLS documents: Política configurada' || E'\n';
  ELSE
    v_msg := v_msg || '⚠️ RLS documents: Sem política' || E'\n';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_users') THEN
    v_msg := v_msg || '✅ RLS system_users: Política configurada' || E'\n';
  ELSE
    v_msg := v_msg || '⚠️ RLS system_users: Sem política' || E'\n';
  END IF;

  -- Verificar indices
  v_msg := v_msg || E'\n--- Índices ---\n';
  
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_students_cpf') THEN
    v_msg := v_msg || '✅ idx_students_cpf: OK' || E'\n';
  ELSE
    v_msg := v_msg || '⚠️ idx_students_cpf: FALTANDO' || E'\n';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_attendance_timestamp') THEN
    v_msg := v_msg || '✅ idx_attendance_timestamp: OK' || E'\n';
  ELSE
    v_msg := v_msg || '⚠️ idx_attendance_timestamp: FALTANDO' || E'\n';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_system_users_email') THEN
    v_msg := v_msg || '✅ idx_system_users_email: OK' || E'\n';
  ELSE
    v_msg := v_msg || '⚠️ idx_system_users_email: FALTANDO' || E'\n';
  END IF;

  -- Admin padrão
  v_msg := v_msg || E'\n--- Dados Iniciais ---\n';
  IF EXISTS (SELECT 1 FROM public.system_users WHERE role = 'Administrador') THEN
    v_msg := v_msg || '✅ Admin padrão: Existe' || E'\n';
  ELSE
    v_msg := v_msg || '⚠️ Admin padrão: Nenhum administrador cadastrado!' || E'\n';
  END IF;

  RAISE NOTICE '%', v_msg;
END $$;

-- ============================================================
-- RESUMO DAS TABELAS E COLUNAS ESPERADAS PELO APP
-- ============================================================
-- 
-- ┌─────────────────────┬──────────────────────────────────────┐
-- │ TABELA              │ COLUNAS                              │
-- ├─────────────────────┼──────────────────────────────────────┤
-- │ students            │ id, cpf, name, department, phone,    │
-- │                     │ birth_date, age, gender, blocked,    │
-- │                     │ on_waitlist, modality, training_days,│
-- │                     │ training_time, created_at            │
-- ├─────────────────────┼──────────────────────────────────────┤
-- │ attendance_records  │ id, student_cpf, timestamp, hour,    │
-- │                     │ photo_url                            │
-- ├─────────────────────┼──────────────────────────────────────┤
-- │ documents           │ id, title, file_name, upload_date,   │
-- │                     │ file_url, file_type, student_id      │
-- ├─────────────────────┼──────────────────────────────────────┤
-- │ system_users        │ id, name, email, cpf, password,      │
-- │                     │ role, active                         │
-- └─────────────────────┴──────────────────────────────────────┘
--
-- CREDENCIAIS PADRÃO DO ADMINISTRADOR:
-- E-mail: admin@academia.go.gov.br
-- Senha:  123456
-- ============================================================
