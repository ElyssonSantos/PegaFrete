import { useEffect, useState } from 'react';
import { requestForToken, onMessageListener } from '../lib/firebase';
import { supabase } from '../lib/supabase';

export const useNotifications = (userId) => {
  const [notification, setNotification] = useState({ title: '', body: '' });

  const activateNotifications = async () => {
    if (!userId) return;
    const token = await requestForToken();
    if (token) {
      localStorage.setItem('fcm_token', token);
      const { error } = await supabase
        .from('push_tokens')
        .upsert([
          { 
            user_id: userId, 
            token: token
          }
        ], { onConflict: 'user_id, token' });

      if (error) {
        console.error('Erro ao salvar push token:', error);
      } else {
        alert('Notificações ativadas com sucesso!');
      }
    }
  };

  useEffect(() => {
    if (!userId) return;

    // Ouvinte para mensagens em primeiro plano
    onMessageListener().then((payload) => {
      setNotification({
        title: payload.notification?.title || 'Nova Notificação',
        body: payload.notification?.body || '',
      });
      console.log('Nova mensagem FCM:', payload);
    });

  }, [userId]);

  return { notification, setNotification, activateNotifications };
};
