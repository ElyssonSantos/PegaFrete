import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Onboarding from './pages/Onboarding';
import SignupSteps from './pages/SignupSteps';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';
import CourierDashboard from './pages/CourierDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DebugNotifications from './pages/DebugNotifications';
import { useNotifications } from './hooks/useNotifications';
import NotificationToast from './components/NotificationToast';
import AdminRoute from './components/AdminRoute';
import { Loader2 } from 'lucide-react';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // Monitorar sessão e onboarding
  useEffect(() => {
    // 1. Checar Onboarding
    const completed = localStorage.getItem('pegafrete_onboarding_completed') === 'true';
    setOnboardingCompleted(completed);

    // 2. Checar Sessão Inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 3. Ouvir mudanças na auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { notification, setNotification } = useNotifications(session?.user?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="animate-spin text-emerald-700" size={48} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <NotificationToast 
          notification={notification} 
          onClose={() => setNotification({ title: '', body: '' })} 
        />
        <Routes>
          {/* Lógica de Roteamento Principal */}
          <Route path="/" element={
            session ? (
              <Navigate to="/client" replace />
            ) : onboardingCompleted ? (
              <Navigate to="/login" replace />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          } />

          <Route path="/onboarding" element={
            session ? <Navigate to="/client" replace /> : <Onboarding />
          } />

          <Route path="/login" element={
            session ? <Navigate to="/client" replace /> : <Login />
          } />

          <Route path="/signup" element={
            session ? <Navigate to="/client" replace /> : <SignupSteps />
          } />

          {/* Rotas Protegidas */}
          <Route path="/client" element={session ? <ClientDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/courier" element={session ? <CourierDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
          <Route path="/debug" element={<DebugNotifications />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
