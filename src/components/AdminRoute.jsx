import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useRole();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="animate-spin text-emerald-800" size={48} />
        <p className="text-muted font-medium">Validando permissões de acesso...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
        <div className="bg-red-50 p-6 rounded-2xl mb-4">
          <ShieldAlert size={64} className="text-red-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Acesso Restrito</h1>
        <p className="text-muted max-w-sm mb-6">
          Esta é uma área exclusiva para administradores. Se você acredita que isso é um erro, por favor, contate o administrador do sistema.
        </p>
        <button 
          className="btn btn-primary" 
          onClick={() => window.location.href = '/'}
        >
          Voltar para Home
        </button>
      </div>
    );
  }

  return children;
}
