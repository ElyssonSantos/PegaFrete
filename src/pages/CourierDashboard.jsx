import React, { useState, useEffect } from 'react';
import { Map, MapPin, Package, Clock, ShieldCheck, ChevronRight, Menu, Navigation, CheckCircle, Navigation2 } from 'lucide-react';
import './CourierDashboard.css';

export default function CourierDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeRide, setActiveRide] = useState(false);
  const [earnings, setEarnings] = useState(145.50);

  useEffect(() => {
    let interval;
    if (activeRide) {
      interval = setInterval(() => {
        // Simula ganhos subindo enquanto navega
        setEarnings(prev => prev + 0.05);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeRide]);

  const handleAcceptRide = () => {
    setActiveRide(true);
  };

  const handleFinishRide = () => {
    setActiveRide(false);
    setEarnings(prev => prev + 15.00); // Adiciona o ganho da corrida
    alert("Entrega concluída! +R$ 15,00 adicionados à sua carteira.");
  };

  if (activeRide) {
    return (
      <div className="courier-container navigation-mode">
        {/* Simulated Map View fullscreen */}
        <div className="fullscreen-map">
          <div className="map-overlay-blur"></div>
          <div className="nav-cursor animate-pulse">
            <Navigation2 size={40} color="#10B981" fill="#10B981" className="rotate-45" />
          </div>
          <svg className="route-path-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M50,90 Q40,60 60,30 T50,10" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" className="path-anim" />
          </svg>
        </div>

        <div className="navigation-header">
           <div className="nav-instruction shadow-lg">
              <span className="direction-icon"><ChevronRight size={32} color="#fff"/></span>
              <div>
                <h2>Em 200m, vire à direita</h2>
                <p>Av. Francisco Porto</p>
              </div>
           </div>
        </div>

        <div className="navigation-footer shadow-float">
           <div className="route-stats">
              <div className="stat"><h3>1.2 km</h3><p>Restantes</p></div>
              <div className="stat"><h3>4 min</h3><p>Tempo est.</p></div>
              <div className="stat highlight"><h3>R$ {earnings.toFixed(2).replace('.', ',')}</h3><p>Ganhos Hoje</p></div>
           </div>
           
           <div className="client-info card">
             <div className="flex-center">
               <div className="point-icon user pulse-bg"><MapPin size={18} color="#fff" /></div>
               <div className="info-text">
                 <h4>Chegar no Cliente: João S.</h4>
                 <span>Pedido #8892 - Entregar em mãos</span>
               </div>
             </div>
           </div>

           <button className="btn btn-primary btn-large btn-scale mt-3 shadow-lg" onClick={handleFinishRide}>
             <CheckCircle size={24} /> Confirmar Entrega
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="courier-container">
      {/* Header Adaptável */}
      <header className="courier-header glass-header">
        <div className="header-left">
          <button className="icon-btn btn-scale shadow-hover" onClick={() => alert("Menu do entregador em desenvolvimento")}>
            <Menu size={24} color="var(--primary-color)" />
          </button>
          <div className="status-toggle shadow-sm" onClick={() => setIsOnline(!isOnline)}>
            <span className={`online-dot ${isOnline ? '' : 'offline'}`}></span>
            <span className="status-text">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        <div className="header-center desktop-only">
          <div className="dashboard-title">Painel de Operações Shopper</div>
        </div>

        <div className="header-right">
          <div className="courier-earnings desktop-only">
            <span className="label">Ganhos Hoje</span>
            <span className="value">R$ {earnings.toFixed(2).replace('.', ',')}</span>
          </div>
          <button className="icon-btn user-avatar btn-scale shadow-hover" onClick={() => alert("Configurações do perfil")}>
            <img src="https://i.pravatar.cc/100?img=11" alt="Perfil" />
          </button>
        </div>
      </header>

      <main className="courier-main-layout">
        <section className="courier-sidebar desktop-only">
           <div className="stats-grid">
             <div className="stat-card premium-glass">
                <span className="stat-label">Ganhos Hoje</span>
                <span className="stat-value">R$ {earnings.toFixed(2).replace('.', ',')}</span>
             </div>
             <div className="stat-card premium-glass">
                <span className="stat-label">Entregas</span>
                <span className="stat-value">12</span>
             </div>
             <div className="stat-card premium-glass">
                <span className="stat-label">Avaliação</span>
                <span className="stat-value">4.9 ⭐</span>
             </div>
             <div className="stat-card premium-glass">
                <span className="stat-label">Tempo Online</span>
                <span className="stat-value">4h 20m</span>
             </div>
           </div>

           <div className="active-orders-list">
              <h3>Próximo Destino</h3>
              <div className="order-item-mini active">
                 <div className="order-header-mini">
                    <span className="id">#8892</span>
                    <span className="time">Há 5 min</span>
                 </div>
                 <div className="order-loc">GBarbosa &rarr; João S.</div>
                 <button className="btn btn-primary btn-sm mt-3" onClick={handleAcceptRide}>Prosseguir</button>
              </div>
           </div>
        </section>

        <section className="courier-map-view">
           {/* Stats Row (Mobile Only) */}
           <div className="stats-row mobile-only">
            <div className="stat-card card-hover premium-glass">
              <span className="stat-label flex-center gap-2"><div className="pulse-dot-green"></div> Ganho Hoje</span>
              <span className="stat-value text-accent">R$ {earnings.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="stat-card card-hover premium-glass">
              <span className="stat-label">Entregas</span>
              <span className="stat-value">12</span>
            </div>
          </div>

          {/* Radar Map Area */}
          <div className={`map-area ${isOnline ? 'searching' : 'dimmed'}`}>
            <div className="radar-container">
               <Map size={48} color="#94A3B8" />
               {isOnline && (
                 <>
                   <div className="radar-ring r1"></div>
                   <div className="radar-ring r2"></div>
                   <div className="radar-ring r3"></div>
                 </>
               )}
            </div>
            <div className="status-text-overlay">
              {isOnline ? 'Procurando corridas na região...' : 'Você está offline. Fique online para começar.'}
            </div>
          </div>

          {/* Available Orders - Bottom Sheet (Mobile Only) */}
          <div className={`orders-sheet mobile-only ${isOnline ? 'active' : 'hidden'} shadow-float`}>
            <div className="sheet-handle"></div>
            <div className="sheet-header">
              <h3>Disponível agora</h3>
              <span className="live-badge pulse-glow">1 NOVA</span>
            </div>
            
            <div className="order-card clean-card card-hover">
              <div className="order-header">
                <div className="order-id">
                   <Package size={18} color="var(--primary-color)" /> Entrega de Mercado
                </div>
                <span className="order-price-large">R$ 15,00</span>
              </div>
              
              <div className="route-info-clean mt-3">
                <div className="route-step">
                  <div className="node store-node"><Store size={14} /></div>
                  <div className="node-info">
                    <span className="action">Coletar em</span>
                    <strong>GBarbosa Hiper</strong>
                    <span className="dist">1.2 km de você</span>
                  </div>
                </div>
                <div className="route-line-clean"></div>
                <div className="route-step">
                  <div className="node user-node"><MapPin size={14} color="#fff" /></div>
                  <div className="node-info">
                    <span className="action">Entregar para</span>
                    <strong>João S.</strong>
                    <span className="dist">Jardins (3.5 km)</span>
                  </div>
                </div>
              </div>

              <div className="order-footer-clean mt-4">
                <div className="tags-row">
                  <span className="premium-tag"><Clock size={14}/> ~30 min</span>
                  <span className="premium-tag"><ShieldCheck size={14}/> Seguro</span>
                </div>
                <button className="btn btn-primary btn-large btn-scale w-full mt-3 shadow-md" onClick={handleAcceptRide}>
                  <span className="text-xl">Aceitar Corrida</span>
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const Store = ({size, color}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
