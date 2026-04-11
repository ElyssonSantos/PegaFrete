import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, Send, Copy, CheckCircle } from 'lucide-react';

export default function DebugNotifications() {
  const [userId] = useState('test-user-' + Math.random().toString(36).substr(2, 9));
  const { notification, setNotification, activateNotifications } = useNotifications(userId);
  const [token, setToken] = useState(localStorage.getItem('fcm_token') || '');
  const [status, setStatus] = useState('');

  const handleActivate = async () => {
    setStatus('Solicitando permissão...');
    try {
      await activateNotifications();
      const newToken = localStorage.getItem('fcm_token');
      if (newToken) {
        setToken(newToken);
        setStatus('Sucesso! Token gerado.');
      } else {
        setStatus('Erro: Token não retornado pelo Firebase.');
      }
    } catch (e) {
      console.error(e);
      setStatus('Erro: ' + (e.message || 'Erro desconhecido') + ' (Ver console para detalhes)');
    }
  };

  const handleSimulate = () => {
    setStatus('Simulando notificação...');
    setNotification({
      title: 'Teste de Notificação',
      body: 'Esta é uma notificação de teste disparada localmente no PegaFrete!'
    });
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      alert('Token copiado!');
    } else {
      alert('Token ainda não gerado. Ative as notificações primeiro.');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#0B3D2E' }}>Debug de Notificações 🔔</h1>
      <p style={{ color: '#64748B' }}>Use esta página para validar o sistema de Push.</p>
      
      {!import.meta.env.VITE_FIREBASE_VAPID_KEY && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ ERRO: VAPID KEY não detectada no arquivo .env!</p>
      )}

      <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '32px' }}>
        <h3>Passo 1: Ativar Sistema</h3>
        <button 
          onClick={handleActivate}
          style={{ 
            background: '#0B3D2E', color: 'white', border: 'none', padding: '12px 24px', 
            borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
          }}
        >
          <Bell size={20} /> Solicitar Permissão e Gerar Token
        </button>
        {status && <p style={{ fontSize: '13px', color: '#0B3D2E', marginTop: '8px' }}>{status}</p>}
      </div>

      <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '16px' }}>
        <h3>Passo 2: Testar Interface (Foreground)</h3>
        <button 
          onClick={handleSimulate}
          style={{ 
            background: '#10B981', color: 'white', border: 'none', padding: '12px 24px', 
            borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
          }}
        >
          <Send size={20} /> Simular Recebimento Local
        </button>
      </div>

      <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '16px' }}>
        <h3>Passo 3: Testar Push Real (FCM)</h3>
        {token && (
          <div style={{ wordBreak: 'break-all', fontSize: '11px', background: '#e2e8f0', padding: '8px', borderRadius: '4px', marginBottom: '8px' }}>
            <strong>Seu Token:</strong> {token}
          </div>
        )}
        <p style={{ fontSize: '14px', color: '#64748B' }}>
          Para testar um push real vindo do servidor, copie seu token e use o Console do Firebase:
        </p>
        <button 
          onClick={handleCopyToken}
          style={{ 
            background: token ? '#64748B' : '#CBD5E1', color: 'white', border: 'none', padding: '12px 24px', 
            borderRadius: '8px', cursor: token ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' 
          }}
          disabled={!token}
        >
          <Copy size={20} /> Copiar Token do Dispositivo
        </button>
      </div>
      
      {notification.title && (
        <div style={{ marginTop: '24px', color: '#059669', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={20} /> Notificação ativa no estado global!
        </div>
      )}
    </div>
  );
}
