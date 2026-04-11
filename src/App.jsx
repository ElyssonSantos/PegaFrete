import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import SignupSteps from './pages/SignupSteps';
import ClientDashboard from './pages/ClientDashboard';
import CourierDashboard from './pages/CourierDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DebugNotifications from './pages/DebugNotifications';
import { useNotifications } from './hooks/useNotifications';
import NotificationToast from './components/NotificationToast';

function App() {
  // Simulando ID do usuário para teste de notificações (em prod deve vir do Auth)
  const [user, setUser] = React.useState({ id: 'dummy-id-for-testing' });
  const { notification, setNotification } = useNotifications(user?.id);

  return (
    <BrowserRouter>
      <div className="app-container">
        <NotificationToast 
          notification={notification} 
          onClose={() => setNotification({ title: '', body: '' })} 
        />
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signup" element={<SignupSteps />} />
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/courier" element={<CourierDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/debug" element={<DebugNotifications />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
