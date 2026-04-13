import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Se logou com sucesso, buscar o perfil para saber a rota
      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .single();

      if (userProfile?.role === 'entregador') {
        navigate('/courier');
      } else if (userProfile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client');
      }
      
    } catch (err) {
      setError(err.message || 'Falha ao entrar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <header className="signup-header">
        <button className="back-btn" onClick={() => navigate('/onboarding')}>
          <ArrowLeft size={24} color="var(--primary-color)" />
        </button>
      </header>

      <div className="signup-content animate-slide-up">
        <div className="text-center mb-5">
           <ShieldCheck size={48} color="var(--primary-color)" className="mx-auto mb-2" />
           <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
           <p className="text-muted">Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="w-full">
          <div className="input-group">
            <label className="input-label">E-mail</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Senha</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-danger text-sm mb-4">{error}</p>}

          <button className="btn btn-primary btn-scale w-full mb-3" type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar'}
          </button>

          <button className="btn btn-outline w-full" onClick={() => navigate('/signup')} type="button">
            Não tenho conta (Criar Cadastro)
          </button>
        </form>
      </div>
    </div>
  );
}
