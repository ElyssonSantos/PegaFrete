// Importar scripts de compatibilidade do Firebase
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyD_mWLCMgKClVpMh81TNC78we8jW8k7fiI",
  authDomain: "pegafrete.firebaseapp.com",
  projectId: "pegafrete",
  storageBucket: "pegafrete.firebasestorage.app",
  messagingSenderId: "890835191626",
  appId: "1:890835191626:web:7ce26f8978f460f7f223b3",
  measurementId: "G-RN6Q4468WZ"
};

firebase.initializeApp(firebaseConfig);

// Inicializar Messaging
const messaging = firebase.messaging();

// Lidar com mensagens em segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensagem recebida em background:', payload);
  
  const notificationTitle = payload.notification.title || 'PegaFrete Mercado';
  const notificationOptions = {
    body: payload.notification.body || 'Você tem uma nova atualização!',
    icon: '/pwa-192x192.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
