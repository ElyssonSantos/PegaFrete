-- PegaFrete Mercado Database Schema

-- users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  birth_date DATE,
  role VARCHAR(50) DEFAULT 'cliente', -- cliente, entregador, admin
  status VARCHAR(50) DEFAULT 'pendente', -- pendente, ativo, bloqueado
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- couriers_info
CREATE TABLE couriers_info (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  vehicle_type VARCHAR(50),
  state VARCHAR(2),
  city VARCHAR(100),
  gender VARCHAR(20),
  cpf VARCHAR(14) UNIQUE,
  cep VARCHAR(10),
  discovery_channel VARCHAR(50),
  front_doc_url TEXT,
  back_doc_url TEXT
);

-- markets
CREATE TABLE markets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150),
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  status VARCHAR(20) DEFAULT 'active'
);

-- orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id),
  courier_id UUID REFERENCES users(id),
  market_id UUID REFERENCES markets(id),
  status VARCHAR(50) DEFAULT 'aguardando_entregador',
  total_amount DECIMAL(10,2),
  delivery_fee DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  product_name VARCHAR(200),
  brand VARCHAR(100),
  max_price DECIMAL(10,2),
  quantity INTEGER,
  observation TEXT,
  actual_price DECIMAL(10,2), -- preenchido pelo entregador
  photo_url TEXT
);

-- delivery_tracking
CREATE TABLE delivery_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  courier_id UUID REFERENCES users(id),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  transaction_id VARCHAR(255),
  method VARCHAR(50), -- pix, cartao
  amount DECIMAL(10,2),
  status VARCHAR(50),
  split_platform DECIMAL(10,2),
  split_courier DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- admin_logs
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id),
  action_type VARCHAR(100),
  target_reference VARCHAR(255), -- Referência a quem ou o que foi alterado
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- system_settings
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- Inserir configurações padrão (Mock/Inicialização)
-- INSERT INTO system_settings (setting_key, setting_value, description) VALUES 
-- ('delivery_rules', '{"base_fee": 10.00, "commission_percentage": 15.0, "min_order_value": 30.00, "min_time_market_min": 20, "max_radius_km": 10}', 'Regras de negócio gerais');

-- user_status_history
CREATE TABLE user_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_by UUID REFERENCES users(id),
  reason TEXT,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- payment_logs
CREATE TABLE payment_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES payments(id),
  event_type VARCHAR(100),
  event_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
