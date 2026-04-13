-- 1. Garante que a coluna role existe (já presente no schema.sql, mas aqui como segurança)
-- Caso precise adicionar em uma tabela existente:
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'cliente';

-- 2. Define o seu e-mail como Administrador
-- SUBSTITUA 'seu-email@exemplo.com' pelo seu e-mail real usado no cadastro
UPDATE users 
SET role = 'admin' 
WHERE email = 'seu-email@exemplo.com';

-- 3. Políticas de RLS (Row Level Security) para Tabelas Administrativas
-- Habilitar RLS nas tabelas sensíveis
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Política: Apenas admins podem ver logs
CREATE POLICY "Apenas admins podem ver logs" 
ON admin_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Política: Apenas admins podem alterar configurações do sistema
CREATE POLICY "Apenas admins podem alterar configuracoes" 
ON system_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);
