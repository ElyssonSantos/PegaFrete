import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Map, Briefcase, Settings, Bell, ScanLine, Clock, Plus, Tag, Trash2, ShoppingBag, CheckCircle, Package, Truck, Store, MapPin, ChevronRight, Zap, X, AlertCircle, Moon, Volume2, Lock, ShieldCheck, Smartphone, MessageCircle, HelpCircle, FileText, LogOut } from 'lucide-react';
import './ClientDashboard.css';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  // Overlays state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  // User details state
  const [currentLocation, setCurrentLocation] = useState('Aracaju, SE');
  const [cepInput, setCepInput] = useState('');

  // Estado do Novo Pedido
  const [supermarket, setSupermarket] = useState('');
  const [orderItems, setOrderItems] = useState([{ id: 1, product: '', brand: '', quantity: 1, maxPrice: '', notes: '' }]);
  
  // Real-time tracking animation state
  const [activeOrder, setActiveOrder] = useState(true);
  const [orderTick, setOrderTick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeOrder) {
      const interval = setInterval(() => {
        setOrderTick(prev => (prev < 4 ? prev + 1 : 0));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeOrder]);

  const handleAddItem = () => setOrderItems([...orderItems, { id: Date.now(), product: '', brand: '', quantity: 1, maxPrice: '', notes: '' }]);
  const handleUpdateItem = (id, field, value) => setOrderItems(orderItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  const handleAddQuantity = (id, amount) => setOrderItems(orderItems.map(item => item.id === id ? { ...item, quantity: item.quantity + amount } : item));
  const handleRemoveItem = (id) => setOrderItems(orderItems.filter(item => item.id !== id));

  const finishOrder = () => {
    if (!supermarket) {
      alert("Por favor, selecione um supermercado.");
      return;
    }
    const emptyProduct = orderItems.find(i => !i.product);
    if (emptyProduct) {
      alert("Preencha o nome do produto para todos os itens.");
      return;
    }
    setActiveOrder(true);
    setOrderTick(0);
    setOrderItems([{ id: Date.now(), product: '', brand: '', quantity: 1, maxPrice: '', notes: '' }]);
    setSupermarket('');
    setActiveTab('home');
  };
  
  const handleLogout = () => {
    navigate('/');
  };

  const handleCategoryClick = (category) => {
    setActiveTab('new');
    if (category === 'Supermercado') setSupermarket('gbarbosa');
    if (category === 'Farmácia') setSupermarket('mercantil'); // Simulating a pharmacy option
  };

  const deliveryFee = 10.00;
  const productsTotal = orderItems.reduce((acc, item) => {
    const priceStr = item.maxPrice.toString().replace(/\./g, '').replace(',', '.');
    return acc + ((parseFloat(priceStr) || 0) * item.quantity);
  }, 0);
  const orderTotal = productsTotal + deliveryFee;

  const renderTimeline = () => {
    const steps = [
      { icon: <Clock size={20}/>, label: "Confirmando", time: "11:42" },
      { icon: <Store size={20}/>, label: "No Mercado", time: "11:55" },
      { icon: <Package size={20}/>, label: "Comprando", time: "12:10" },
      { icon: <Truck size={20}/>, label: "A Caminho", time: "12:25" },
      { icon: <MapPin size={20}/>, label: "Entregue", time: "Est. 12:40" }
    ];

    return (
      <div className="live-tracking-card animate-slide-up">
        <div className="tracking-header">
          <div>
            <h4>Pedido em Andamento</h4>
            <span className="text-muted text-sm">GBarbosa • Previsão: 12:40</span>
          </div>
          <div className="live-pulse"></div>
        </div>
        <div className="timeline-container">
          {steps.map((step, idx) => (
            <div key={idx} className={`timeline-step ${idx <= orderTick ? 'completed' : ''} ${idx === orderTick ? 'current' : ''}`}>
              <div className="step-icon-wrapper shadow-hover">{step.icon}</div>
              <div className="step-info">
                <strong>{step.label}</strong>
                <span>{step.time}</span>
              </div>
              {idx < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
        <button className="btn btn-outline btn-scale mt-3 w-full" style={{padding: '12px', fontSize: '14px', borderRadius: '12px'}} onClick={() => setActiveTab('orders')}>
          Ver detalhes do pedido <ChevronRight size={16}/>
        </button>
      </div>
    );
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <div className="animate-fade-in">
            {activeOrder && renderTimeline()}
            {loading ? <div className="skeleton banner-skeleton mt-3"></div> : (
              <div className="promo-banner card-hover mt-3">
                <div className="promo-content">
                  <span className="promo-tag"><Clock size={14}/> Entrega em 40min</span>
                  <h2>Faça a feira<br/>sem sair de casa</h2>
                  <button onClick={() => setActiveTab('new')} className="btn-scale text-primary">Peça agora</button>
                </div>
                <div className="promo-image">🛒</div>
              </div>
            )}
            <section className="categories-section mt-4">
              <h3>Categorias</h3>
              <div className="categories-grid">
                {['Supermercado', 'Farmácia', 'Hortifruti', 'Bebidas'].map((cat, i) => (
                  <div className="category-item btn-scale" key={i} onClick={() => handleCategoryClick(cat)}>
                    <div className="cat-icon-container shadow-hover">
                      {i === 0 ? '🛒' : i === 1 ? '💊' : i === 2 ? '🍎' : '🍷'}
                    </div>
                    <span>{cat}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="offers-section mt-4">
              <div className="section-header">
                <h3>Ofertas Populares</h3>
                <button className="see-all btn-scale text-primary" onClick={() => setActiveTab('offers')}>Ver todas</button>
              </div>
              <div className="products-scroll pb-2">
                {[1, 2, 3].map((item) => loading ? <div className="skeleton product-skeleton" key={item}></div> : (
                  <div className="product-card card-hover" key={item}>
                    <div className="discount-tag">-10%</div>
                    <div className="product-img">{item === 1 ? '🥩' : item === 2 ? '🍺' : '🍞'}</div>
                    <div className="product-info">
                      <div className="rating">⭐⭐⭐⭐⭐</div>
                      <h4>{item === 1 ? 'Picanha' : item === 2 ? 'Heineken 6x' : 'Pão de Forma'}</h4>
                      <span className="price">R$ {item === 1 ? '59,90' : '35,90'}</span>
                    </div>
                    <button className="add-btn btn-scale" onClick={() => setActiveTab('new')}><Plus size={20} color="#fff"/></button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'offers':
        return (
          <div className="tab-placeholder animate-fade-in">
            <Tag size={48} color="var(--primary-color)" />
            <h2>Menu de Ofertas</h2>
            <p>Descubra as melhores promoções da sua região atualizadas em tempo real.</p>
            <button className="btn btn-outline mt-3 btn-scale" onClick={() => setActiveTab('home')}>Voltar ao início</button>
          </div>
        );
      case 'orders':
        return (
          <div className="orders-tab animate-fade-in">
            <h2 className="mb-4 text-dark font-bold text-3xl">Seus Pedidos</h2>
            
            <div className="orders-layout">
              <div className="orders-list-side">
                <h3 className="section-title text-sm uppercase text-muted font-bold mb-3">Em andamento</h3>
                {activeOrder ? (
                  <div className="order-item-card active shadow-md mb-4 border-l-4 border-accent">
                    <div className="order-item-main">
                      <div className="order-item-header">
                        <div className="flex items-center gap-2">
                           <div className="pulse-dot-green"></div>
                           <span className="font-bold text-dark">Pedido #8892</span>
                        </div>
                        <span className="text-xs text-muted">Hoje, 11:40</span>
                      </div>
                      <div className="order-item-body mt-2">
                        <p className="text-sm font-semibold text-dark">GBarbosa Hiper</p>
                        <p className="text-xs text-muted">Aguardando coleta pelo entregador</p>
                      </div>
                      <div className="progress-container mt-3">
                         <div className="progress-bar-small">
                            <div className="progress-fill pulse-animation" style={{width: `${(orderTick/4)*100}%`, background: 'var(--accent-color)'}}></div>
                         </div>
                      </div>
                      <button className="btn btn-outline btn-sm mt-3 w-full desktop-only">Acompanhar no Mapa</button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state-mini p-4 text-center border-dashed border-2 rounded-lg mb-4">
                     <p className="text-xs text-muted">Nenhum pedido ativo no momento</p>
                  </div>
                )}

                <h3 className="section-title text-sm uppercase text-muted font-bold mb-3 mt-6">Anteriores</h3>
                <div className="order-item-card past shadow-xs p-4 mb-3 card-hover border border-light">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-dark">Assaí Atacadista</h4>
                        <p className="text-xs text-muted mt-1">02 Abr • 28 Itens • R$ 345,90</p>
                      </div>
                      <span className="status-tag delivered text-xs font-bold px-2 py-1 rounded bg-green-50 text-green-600">Entregue</span>
                    </div>
                </div>
                <div className="order-item-card past shadow-xs p-4 mb-3 card-hover border border-light opacity-75">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-dark">Mercantil Rodrigues</h4>
                        <p className="text-xs text-muted mt-1">28 Mar • 12 Itens • R$ 112,40</p>
                      </div>
                      <span className="status-tag delivered text-xs font-bold px-2 py-1 rounded bg-green-50 text-green-600">Entregue</span>
                    </div>
                </div>
                <button className="btn btn-primary mt-6 btn-scale shadow-md" onClick={() => setActiveTab('new')}><Plus size={20}/> Novo Pedido Personalizado</button>
              </div>

              <div className="order-details-side desktop-only">
                 <div className="card shadow-md p-6 h-full border-light">
                   {activeOrder ? (
                     <div className="order-details-content">
                        <div className="details-header border-b pb-4 mb-4">
                           <h3 className="text-xl font-bold">Resumo da Entrega #8892</h3>
                           <p className="text-sm text-muted">Acompanhamento detalhado em tempo real</p>
                        </div>
                        <div className="delivery-step-list">
                           <div className="d-step completed">
                              <div className="d-icon"><Check size={14}/></div>
                              <div className="d-info">
                                 <strong>Pedido Recebido</strong>
                                 <span>Confirmado pelo parceiro</span>
                              </div>
                           </div>
                           <div className="d-step current">
                              <div className="d-icon"><ShoppingBag size={14}/></div>
                              <div className="d-info">
                                 <strong>Em Separação</strong>
                                 <span>O shopper está no mercado selecionando seus produtos</span>
                              </div>
                           </div>
                           <div className="d-step">
                              <div className="d-icon"><Bike size={14}/></div>
                              <div className="d-info">
                                 <strong>A caminho</strong>
                                 <span>O pedido sairá para entrega em breve</span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="shoppers-card mt-6 p-4 bg-slate-50 rounded-lg flex items-center gap-4">
                           <img src="https://i.pravatar.cc/100?img=11" className="w-12 h-12 rounded-full" alt="Shopper"/>
                           <div>
                              <p className="text-xs text-muted uppercase font-bold">Seu Entregador</p>
                              <p className="font-bold text-dark">Marcos Tadeu</p>
                              <p className="text-xs text-accent">Entregador Nível Ouro</p>
                           </div>
                        </div>

                        <button className="btn btn-outline w-full mt-6" onClick={() => alert('Abrir chat')}>Abrir Chat com Shopper</button>
                     </div>
                   ) : (
                     <div className="empty-details flex-col flex-center h-full text-center">
                        <Package size={64} className="text-slate-200 mb-4" />
                        <h3 className="text-slate-400">Selecione um pedido para ver os detalhes completos</h3>
                     </div>
                   )}
                 </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="settings-tab animate-fade-in pb-4">
            <h2 className="mb-4 mt-2 px-1">Configurações</h2>
            
            {/* 1. CONTA */}
            <div className="settings-section">
              <div className="profile-card card shadow-hover mb-4">
                <div className="profile-info flex-center gap-4">
                  <div className="avatar-large">
                    <img src="https://i.pravatar.cc/150?img=68" alt="User Avatar" />
                  </div>
                  <div className="profile-texts">
                    <h3 className="m-0 text-dark">Elysson Santana</h3>
                    <span className="text-muted text-sm">elysson@exemplo.com</span>
                  </div>
                </div>
                <div className="profile-actions mt-4 flex gap-3">
                   <button className="btn btn-outline flex-1 btn-scale text-sm">Editar perfil</button>
                   <button className="btn btn-outline flex-1 btn-scale text-sm" onClick={() => setShowLocationModal(true)}>Endereços</button>
                </div>
              </div>
            </div>

            {/* 2. PREFERÊNCIAS */}
            <div className="settings-section mb-4">
              <h4 className="section-title text-muted text-xs font-bold uppercase tracking-wider mb-2 px-1">Preferências</h4>
              <div className="settings-group card shadow-sm p-0 overflow-hidden border-card">
                <div className="setting-item flex justify-between items-center p-4 border-b card-hover cursor-pointer" onClick={() => alert('Notificações ativadas')}>
                  <div className="flex-center gap-3">
                    <Bell size={20} color="var(--primary-color)"/>
                    <span className="font-semibold text-dark">Notificações</span>
                  </div>
                  <div className="custom-switch active"></div>
                </div>
                <div className="setting-item flex justify-between items-center p-4 border-b card-hover cursor-pointer" onClick={() => alert('Modo escuro em breve')}>
                  <div className="flex-center gap-3">
                    <Moon size={20} color="var(--primary-color)"/>
                    <span className="font-semibold text-dark">Modo Escuro</span>
                  </div>
                  <div className="custom-switch"></div>
                </div>
                <div className="setting-item flex justify-between items-center p-4 card-hover cursor-pointer" onClick={() => alert('Sons desativados')}>
                  <div className="flex-center gap-3">
                    <Volume2 size={20} color="var(--primary-color)"/>
                    <span className="font-semibold text-dark">Sons do App</span>
                  </div>
                  <div className="custom-switch active"></div>
                </div>
              </div>
            </div>

            {/* 3. SEGURANÇA */}
            <div className="settings-section mb-4">
              <h4 className="section-title text-muted text-xs font-bold uppercase tracking-wider mb-2 px-1">Segurança</h4>
              <div className="settings-group card shadow-sm p-0 overflow-hidden border-card">
                <div className="setting-item flex justify-between items-center p-4 border-b card-hover cursor-pointer" onClick={()=>alert('Alterar senha')}>
                  <div className="flex-center gap-3">
                    <Lock size={20} color="var(--primary-color)"/>
                    <span className="font-semibold text-dark">Alterar Senha</span>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)"/>
                </div>
                <div className="setting-item flex justify-between items-center p-4 border-b card-hover cursor-pointer" onClick={()=>alert('Verificação de conta OK')}>
                  <div className="flex-center gap-3">
                    <ShieldCheck size={20} color="var(--primary-color)"/>
                    <span className="font-semibold text-dark">Verificação de conta</span>
                  </div>
                  <span className="badge-success text-xs font-bold p-1 px-2 rounded-full">Ativo</span>
                </div>
                <div className="setting-item flex justify-between items-center p-4 card-hover cursor-pointer">
                  <div className="flex-center gap-3">
                    <Smartphone size={20} color="var(--primary-color)"/>
                    <span className="font-semibold text-dark">Gerenciar Sessões</span>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)"/>
                </div>
              </div>
            </div>

            {/* 4. SUPORTE */}
            <div className="settings-section mb-5">
              <h4 className="section-title text-muted text-xs font-bold uppercase tracking-wider mb-2 px-1">Suporte</h4>
              <div className="settings-group card shadow-sm p-0 overflow-hidden border-card">
                <div className="setting-item flex justify-between items-center p-4 border-b card-hover cursor-pointer">
                  <div className="flex-center gap-3">
                    <MessageCircle size={20} color="var(--primary-color)"/>
                    <span className="font-semibold text-dark">Fale Conosco</span>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)"/>
                </div>
                <div className="setting-item flex justify-between items-center p-4 border-b card-hover cursor-pointer">
                  <div className="flex-center gap-3">
                    <HelpCircle size={20} color="var(--primary-color)"/>
                    <span className="font-semibold text-dark">Central de Ajuda</span>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)"/>
                </div>
                <div className="setting-item flex justify-between items-center p-4 card-hover cursor-pointer">
                  <div className="flex-center gap-3">
                    <FileText size={20} color="var(--primary-color)"/>
                    <span className="font-semibold text-dark">Termos de uso & Privacidade</span>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)"/>
                </div>
              </div>
            </div>

            {/* 5. SESSÃO */}
            <div className="settings-section mb-5 mt-4">
               <button className="btn btn-outline border-danger btn-scale w-full flex-center justify-center gap-2 shadow-sm delete-session-btn" onClick={() => { if(window.confirm('Tem certeza que deseja sair de sua conta?')) handleLogout(); }}>
                  <LogOut size={20}/>
                  Sair da Conta
               </button>
            </div>
          </div>
        );
      case 'new':
        return (
          <div className="new-order-section animate-slide-in-right">
            <h2 className="mb-1 text-primary">Novo Pedido</h2>
            <p className="subtitle mb-5">Preencha o que precisa que nós compramos para você.</p>
            
            <div className="new-order-layout">
              <div className="new-order-items-side">
                <div className="input-group">
                  <label className="input-label">Onde vamos comprar? <span className="text-muted text-sm">(Mercados verificados)</span></label>
                  <select className="input-field highlight-focus shadow-sm" value={supermarket} onChange={(e) => setSupermarket(e.target.value)}>
                    <option value="">Selecione o melhor mercado para você...</option>
                    <option value="gbarbosa">GBarbosa Hiper</option>
                    <option value="assai">Assaí Atacadista</option>
                    <option value="mercantil">Mercantil Rodrigues</option>
                  </select>
                </div>

                <div className="order-items-container">
                  {orderItems.map((item, index) => (
                    <div key={item.id} className="card item-card mb-4 shadow-hover form-card-3d">
                      <div className="item-header">
                        <h4 className="text-primary flex-center gap-2"><Package size={18}/> Produto {index + 1}</h4>
                        {orderItems.length > 1 && (
                          <button className="icon-btn-small btn-scale" onClick={() => handleRemoveItem(item.id)}>
                            <Trash2 size={18} color="#EF4444" />
                          </button>
                        )}
                      </div>
                      
                      <div className="input-group">
                        <label className="input-label">O que você precisa? *</label>
                        <input type="text" className="input-field shadow-xs highlight-focus" placeholder="Ex: Arroz branco tipo 1" value={item.product} onChange={(e) => handleUpdateItem(item.id, 'product', e.target.value)} />
                      </div>
                      
                      <div className="input-row">
                        <div className="input-group flex-1">
                          <label className="input-label">Marca Ideal</label>
                          <input type="text" className="input-field shadow-xs highlight-focus" placeholder="Opcional" value={item.brand} onChange={(e) => handleUpdateItem(item.id, 'brand', e.target.value)} />
                        </div>
                        <div className="input-group flex-1">
                          <label className="input-label">Quantidade *</label>
                          <div className="quantity-advanced">
                            <div className="quantity-selector shadow-xs">
                              <button className="btn-scale" onClick={() => handleUpdateItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}>-</button>
                              <span>{item.quantity}</span>
                              <button className="btn-scale" onClick={() => handleUpdateItem(item.id, 'quantity', item.quantity + 1)}>+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn btn-outline btn-scale mb-4 glass-panel" onClick={handleAddItem} style={{borderStyle: 'dashed', color: 'var(--primary-color)'}}>
                  <Plus size={20} /> Adicionar outro produto
                </button>
              </div>

              <div className="new-order-summary-side">
                <div className="order-summary-box card-hover float-effect sticky-summary">
                  <h3 className="mb-4 text-dark">Resumo do Pedido</h3>
                  <div className="summary-row">
                    <span>Subtotal (Previsão max.)</span>
                    <span>R$ {productsTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="summary-row">
                    <span>Taxa de parceiro (Fixo)</span>
                    <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <hr className="summary-divider"/>
                  <div className="summary-total">
                    <strong>Total estimado</strong>
                    <strong className="text-3xl text-primary drop-shadow-sm">R$ {orderTotal.toFixed(2).replace('.', ',')}</strong>
                  </div>
                  
                  <div className="security-badge mt-4">
                    <CheckCircle size={16} color="var(--success)"/> Você só paga após conferir os cupons do mercado.
                  </div>

                  <button className="btn btn-primary btn-checkout mt-6 btn-scale shadow-lg w-full" onClick={finishOrder}>
                    <span>Finalizar Pedido</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR DESKTOP */}
      <aside className="desktop-sidebar desktop-only">
        <div className="sidebar-brand">
          <ShoppingBag size={28} color="var(--primary-color)" />
          <span>PegaFrete</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className={`sidebar-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <Home size={22} /> <span>Início</span>
          </button>
          <button className={`sidebar-item ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => setActiveTab('offers')}>
            <Tag size={22} /> <span>Ofertas</span>
          </button>
          <button className={`sidebar-item ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>
            <Plus size={22} /> <span>Novo Pedido</span>
          </button>
          <button className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <Briefcase size={22} /> <span>Meus Pedidos</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-item" onClick={() => setActiveTab('settings')}>
            <Settings size={22} /> <span>Configurações</span>
          </button>
          <button className="sidebar-item logout" onClick={handleLogout}>
            <LogOut size={22} /> <span>Sair</span>
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        {/* HEADER (Adaptável) */}
        <header className="dash-header">
           <div className="header-left">
             <div className="location-info">
               <span className="location-label">Entregar em</span>
               <div className="location-value btn-scale" style={{cursor: 'pointer'}} onClick={() => setShowLocationModal(true)}>
                 <MapPin size={16} color="var(--primary-color)" />
                 <strong className="text-dark line-clamp">{currentLocation}</strong>
               </div>
             </div>
           </div>

           <div className="header-center desktop-only">
              <div className="search-bar shadow-sm">
                <Search size={18} color="var(--text-muted)" />
                <input type="text" placeholder="Diga o que você precisa..." />
              </div>
           </div>

           <div className="header-right">
              <button className="icon-btn btn-scale desktop-only">
                <Bell size={20} color="var(--text-dark)" />
                <span className="badge"></span>
              </button>
              <div className="user-profile-header desktop-only" onClick={() => setActiveTab('settings')}>
                <img src="https://i.pravatar.cc/150?img=68" alt="User" />
                <div className="user-info-text">
                  <span className="user-name">Elysson Santana</span>
                  <span className="user-role">Cliente Gold</span>
                </div>
              </div>
           </div>
        </header>

        {/* SEARCH/SCANNER (Mobile Only) */}
        <div className="search-section mobile-only">
          <div className="search-bar shadow-md highlight-focus">
            <Search size={20} color="var(--text-muted)" />
            <input type="text" placeholder="Diga o que você precisa..." />
            <button className="scan-btn btn-scale" onClick={() => setShowScannerModal(true)}>
              <ScanLine size={20} color="var(--primary-color)" />
            </button>
          </div>
        </div>

        <main className="dash-main">
          <div className="content-container">
            {renderContent()}
          </div>
          <div className="spacer-bottom mobile-only" style={{height: '100px'}}></div>
        </main>
      </div>

      {/* BOTTOM NAV (Mobile Only) */}
      <nav className="bottom-nav mobile-only">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Home size={24} />
          <span>Início</span>
        </button>
        <button className={`nav-item ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => setActiveTab('offers')}>
          <Tag size={24} />
          <span>Ofertas</span>
        </button>
        <button className={`nav-item nav-main-action ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>
          <div className="nav-main-icon-container">
            <Plus size={24} />
          </div>
          <span>Pedir</span>
        </button>
        <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          <Briefcase size={24} />
          <span>Pedidos</span>
        </button>
        <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <Settings size={24} />
          <span>Perfil</span>
        </button>
      </nav>

      {/* MODALS */}
      
      {/* LOCATION OVERLAY */}
      {showLocationModal && (
        <div className="overlay-fullscreen animate-slide-up">
          <div className="modal-header">
            <h3>Seu Endereço</h3>
            <button className="icon-btn" onClick={() => setShowLocationModal(false)}><X size={24}/></button>
          </div>
          <div className="modal-body">
            <div className="input-group">
              <label className="input-label">Digite seu CEP</label>
              <div className="flex gap-2">
                <input type="text" className="input-field" placeholder="Ex: 49000-000" value={cepInput} onChange={(e) => setCepInput(e.target.value)} />
                <button className="btn btn-primary" style={{width: 'auto'}} onClick={() => { setCurrentLocation(`CEP ${cepInput}`); setShowLocationModal(false); }}>Buscar</button>
              </div>
            </div>
            
            <div className="recent-locations mt-4">
              <h4 className="text-muted text-sm mb-2">Locais Salvos</h4>
              <div className="card flex-center gap-3 shadow-sm card-hover mb-2" onClick={() => { setCurrentLocation('Casa - Aracaju, SE'); setShowLocationModal(false); }}>
                <Home size={20} color="var(--primary-color)"/><div><strong>Casa</strong><p className="text-xs text-muted">Av. Francisco Porto, 1200</p></div>
              </div>
              <div className="card flex-center gap-3 shadow-sm card-hover" onClick={() => { setCurrentLocation('Trabalho - Aracaju, SE'); setShowLocationModal(false); }}>
                <Briefcase size={20} color="var(--primary-color)"/><div><strong>Trabalho</strong><p className="text-xs text-muted">Rua da Frente, 345</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCANNER OVERLAY */}
      {showScannerModal && (
        <div className="overlay-fullscreen scanner-mode">
          <div className="scanner-header">
            <button className="icon-btn text-white" onClick={() => setShowScannerModal(false)}>
              <X size={32} color="#fff" />
            </button>
            <h3 style={{color: 'white', fontWeight: 500}}>Escaneie o código</h3>
            <div style={{width: 32}}></div>
          </div>
          
          <div className="scanner-viewfinder">
            <div className="scanner-corner top-left"></div>
            <div className="scanner-corner top-right"></div>
            <div className="scanner-corner bottom-left"></div>
            <div className="scanner-corner bottom-right"></div>
            <div className="scanner-laser"></div>
          </div>
          
          <div className="scanner-footer">
             <AlertCircle size={20} color="var(--warning)"/>
             <span style={{color: 'white'}}>Aponte para o código de barras do produto para adicioná-lo à sua lista.</span>
          </div>
          
          <div className="scanner-simulated-action">
            <button className="btn btn-primary shadow-float pulse-glow" onClick={() => {
              setOrderItems([...orderItems, { id: Date.now(), product: 'Feijão Carioca Kicaldo 1kg', brand: 'Kicaldo', quantity: 1, maxPrice: '8,50', notes: '' }]);
              setShowScannerModal(false);
              setActiveTab('new');
              alert("Produto 'Feijão Carioca Kicaldo 1kg' encontrado e adicionado!");
            }}>
               Simular leitura de Feijão
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
