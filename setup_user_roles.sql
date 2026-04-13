-- 1. Criar a tabela de cargos/roles
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança (RLS)

-- SELECT: O usuário pode ler apenas seu próprio cargo, ou admins podem ler todos
CREATE POLICY "Usuários podem ver seu próprio cargo" 
ON user_roles 
FOR SELECT 
USING (
  auth.uid() = id 
  OR 
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- INSERT/UPDATE/DELETE: Apenas Admins podem gerenciar cargos
CREATE POLICY "Apenas admins podem modificar cargos" 
ON user_roles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 4. Inserir Admin Inicial
-- SUBSTITUA 'SEU_EMAIL_AQUI' pelo seu e-mail real
-- IMPORTANTE: O usuário já deve existir no auth.users do Supabase
-- INSERT INTO user_roles (id, email, role) 
-- VALUES ('ID_DO_USUARIO_AQUI', 'SEU_EMAIL_AQUI', 'admin');
