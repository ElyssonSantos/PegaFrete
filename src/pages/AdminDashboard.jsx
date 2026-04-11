import { 
  LayoutDashboard, Users, Bike, ShoppingBag, Store, 
  Wallet, Settings, LogOut, Search, Bell, TrendingUp, 
  Menu, X, Check, Activity, MoreVertical, ShieldAlert,
  ChevronRight, MapPin, Package, Clock, ShieldCheck,
  Send, History, Image as ImageIcon, Trash2, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [metrics, setMetrics] = useState({ orders: 0, revenue: 0, couriers: 0, active: 0 });
  
  // Real Data States
  const [dbOrders, setDbOrders] = useState([]);
  const [dbCouriers, setDbCouriers] = useState([]);
  const [dbMarkets, setDbMarkets] = useState([]);
  const [dbPayments, setDbPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Notification States
  const [notifHistory, setNotifHistory] = useState([]);
  const [notifForm, setNotifForm] = useState({ title: '', body: '', image_url: '', target: 'all' });
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Count up animation mockup
    let timer = setInterval(() => {
      setMetrics(prev => ({
        orders: prev.orders < 145 ? prev.orders + 5 : 145,
        revenue: prev.revenue < 4250.90 ? prev.revenue + 150 : 4250.90,
        couriers: prev.couriers < 28 ? prev.couriers + 1 : 28,
        active: prev.active < 12 ? prev.active + 1 : 12
      }));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, client:client_id(first_name, last_name), courier:courier_id(first_name, last_name), market:market_id(name)')
        .order('created_at', { ascending: false });

      const { data: couriersData } = await supabase
        .from('users')
        .select('*, info:couriers_info(*)')
        .eq('role', 'entregador');

      const { data: marketsData } = await supabase
        .from('markets')
        .select('*');

      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*, order:orders(id)');

      if (ordersData) setDbOrders(ordersData);
      if (couriersData) setDbCouriers(couriersData);
      if (marketsData) setDbMarkets(marketsData);
      if (paymentsData) {
        setDbPayments(paymentsData);
        const totalRevenue = paymentsData.reduce((acc, curr) => acc + Number(curr.amount), 0);
        setMetrics({
          orders: ordersData?.length || 0,
          revenue: totalRevenue,
          couriers: couriersData?.length || 0,
          active: ordersData?.filter(o => o.status !== 'entregue' && o.status !== 'cancelado').length || 0
        });
      }
      
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleAction = (actionName, requiresConfirm = true) => {
    if (requiresConfirm) {
      if (window.confirm(`Tem certeza que deseja executar a ação: ${actionName}?`)) {
        alert(`${actionName} executada com sucesso!`);
      }
    } else {
      alert(`${actionName} executada!`);
    }
  };

  const MOCK_ORDERS = [
    { id: '#8892', client: 'João S.', courier: 'Marcos T.', market: 'GBarbosa', value: '145,90', status: 'Em Rota', cod_color: 'info' },
    { id: '#8891', client: 'Maria D.', courier: '-', market: 'Mercantil', value: '89,50', status: 'Aguardando', cod_color: 'warning' },
    { id: '#8890', client: 'Carlos E.', courier: 'Ana P.', market: 'Assaí', value: '310,00', status: 'Entregue', cod_color: 'success' },
  ];

  /* Modal de Detalhes do Pedido */
  const OrderModal = () => {
    if (!selectedOrder) return null;
    return (
      <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3><ShoppingBag size={20}/> Detalhes do Pedido {selectedOrder.id}</h3>
            <button className="btn-icon" onClick={() => setSelectedOrder(null)}><X size={20}/></button>
          </div>
          <div className="modal-body">
             <div className="settings-grid" style={{marginBottom: '20px'}}>
               <div>
                  <p className="mobile-detail-label">Cliente</p>
                  <p className="mobile-detail-value">{selectedOrder.client}</p>
               </div>
               <div>
                  <p className="mobile-detail-label">Entregador</p>
                  <p className="mobile-detail-value">{selectedOrder.courier}</p>
               </div>
             </div>

             <h4 style={{marginTop: 0}}>Timeline</h4>
             <div className="order-timeline">
                <div className="timeline-item completed">
                   <div className="timeline-dot"></div>
                   <div className="timeline-content">
                      <h4>Pedido Criado</h4>
                      <p>Hoje, 11:40</p>
                   </div>
                </div>
                <div className="timeline-item completed">
                   <div className="timeline-dot"></div>
                   <div className="timeline-content">
                      <h4>Aceito pelo Entregador</h4>
                      <p>Hoje, 11:45</p>
                   </div>
                </div>
                <div className="timeline-item">
                   <div className="timeline-dot"></div>
                   <div className="timeline-content">
                      <h4>Em Trânsito</h4>
                      <p>A caminho do cliente</p>
                   </div>
                </div>
             </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => handleAction('Cancelar Pedido ' + selectedOrder.id)}>Cancelar Pedido</button>
            <button className="btn-primary-admin" onClick={() => handleAction('Forçar Conclusão do Pedido ' + selectedOrder.id)}>Forçar Entregue</button>
          </div>
        </div>
      </div>
    );
  };

  /* ----- RENDER TABS ----- */
  const renderDashboard = () => (
    <div className="animate-fade">
      <div className="page-header">
        <h2 className="page-title">Visão Geral</h2>
      </div>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon blue"><ShoppingBag size={24} /></div>
          <div className="metric-info">
            <h3>Pedidos Hoje</h3>
            <p>{metrics.orders}</p>
            <span className="trend-indicator up">▲ 12% vs ontem</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon green"><TrendingUp size={24} /></div>
          <div className="metric-info">
            <h3>Faturamento</h3>
            <p>R$ {metrics.revenue.toFixed(2).replace('.', ',')}</p>
            <span className="trend-indicator up">▲ 5% vs ontem</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon purple"><Bike size={24} /></div>
          <div className="metric-info">
            <h3>Couriers Online</h3>
            <p>{metrics.couriers}</p>
            <span className="trend-indicator down">▼ 2 agora</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon orange"><Activity size={24} /></div>
          <div className="metric-info">
            <h3>Em Andamento</h3>
            <p>{metrics.active}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="page-header" style={{marginBottom: '16px'}}>
          <h3 style={{margin: 0, fontSize: '16px'}}>Monitor de Pedidos (Live)</h3>
          <button className="btn-secondary" onClick={() => setActiveTab('orders')} style={{padding: '6px 12px', fontSize: '12px'}}>Ver Todos</button>
        </div>
        
        {/* Desktop Table View */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Entregador</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.id}</strong></td>
                  <td>{o.client}</td>
                  <td>{o.courier}</td>
                  <td><span className={`status-badge ${o.cod_color}`}>{o.status}</span></td>
                  <td>
                    <button className="btn-icon" onClick={() => setSelectedOrder(o)} title="Detalhes"><Search size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="mobile-card-list">
          {MOCK_ORDERS.map((o) => (
            <div className="mobile-item-card" key={`mob-${o.id}`}>
              <div className="mobile-item-header">
                <strong>{o.id}</strong>
                <span className={`status-badge ${o.cod_color}`}>{o.status}</span>
              </div>
              <div className="mobile-item-details">
                <div className="mobile-detail-group">
                   <span className="mobile-detail-label">Cliente</span>
                   <span className="mobile-detail-value">{o.client}</span>
                </div>
                <div className="mobile-detail-group">
                   <span className="mobile-detail-label">Entregador</span>
                   <span className="mobile-detail-value">{o.courier}</span>
                </div>
              </div>
              <button className="btn-secondary" style={{width: '100%'}} onClick={() => setSelectedOrder(o)}>
                Ver Detalhes do Pedido
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h2 className="page-title">Usuários</h2>
          <p style={{margin: 0, color: '#64748B', fontSize: '14px'}}>Gerencie clientes e aprovações de conta.</p>
        </div>
        <button className="btn-primary-admin" onClick={() => alert('Abrir modal de novo usuário')}>+ Novo Usuário</button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr><th>Nome</th><th>Contato</th><th>Tipo</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>João Santos</td>
                <td>joao@ex.com<br/><small style={{color: '#64748B'}}>(79) 9999-0000</small></td>
                <td><span className="status-badge info">Cliente</span></td>
                <td><span className="status-badge success">Ativo</span></td>
                <td>
                  <div className="action-group">
                    <button className="btn-icon danger" onClick={() => handleAction('Bloquear João')} title="Bloquear"><ShieldAlert size={18}/></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="animate-fade">
      <div className="page-header">
        <h2 className="page-title">Configurações Gerais</h2>
      </div>
      
      <div className="settings-grid">
        <div className="card">
          <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '16px'}}>Taxas e Financeiro</h3>
          <div className="form-group">
            <label>Taxa Base de Entrega (R$)</label>
            <input type="number" defaultValue="5.00" step="0.5" />
          </div>
          <div className="form-group">
            <label>Comissão da Plataforma (%)</label>
            <input type="number" defaultValue="15.0" step="0.5" />
          </div>
          <button className="btn-primary-admin" onClick={() => handleAction('Salvar Taxas', false)}>Salvar Configurações</button>
        </div>

        <div className="card">
          <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '16px'}}>Operacionais</h3>
          <div className="form-group">
            <label>Raio Máximo de Busca para Shoppers (Km)</label>
            <input type="number" defaultValue="10" />
          </div>
          <div className="form-group">
            <label>Auto-cancelamento se não aceito em (min)</label>
            <input type="number" defaultValue="15" />
          </div>
          <button className="btn-primary-admin" onClick={() => handleAction('Salvar Operacionais', false)}>Salvar Regras</button>
        </div>
      </div>
    </div>
  );

  const fetchNotifHistory = async () => {
    setIsLoadingHistory(true);
    const { data, error } = await supabase
      .from('notification_history')
      .select('*')
      .order('sent_at', { ascending: false });
    
    if (!error) setNotifHistory(data);
    setIsLoadingHistory(false);
  };

  useEffect(() => {
    if (activeTab === 'notifications') {
      fetchNotifHistory();
    }
  }, [activeTab]);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifForm.title || !notifForm.body) return;

    setIsSending(true);
    try {
      // 1. Salvar no histórico
      const { error: dbError } = await supabase
        .from('notification_history')
        .insert([{
          title: notifForm.title,
          body: notifForm.body,
          image_url: notifForm.image_url,
          target: notifForm.target
        }]);

      if (dbError) throw dbError;

      // 2. Disparar via Edge Function
      const { data: { publicUrl } } = supabase.storage.from('functions').getPublicUrl('send-notification'); // Apenas para exemplo de URL
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          title: notifForm.title,
          body: notifForm.body,
          image: notifForm.image_url,
          target: notifForm.target
        })
      });

      if (!response.ok) throw new Error('Falha ao disparar push via servidor');

      alert('Notificação enviada com sucesso para o servidor de Push!');
      
      setNotifForm({ title: '', body: '', image_url: '', target: 'all' });
      fetchNotifHistory();
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  const reuseNotification = (notif) => {
    setNotifForm({
      title: notif.title,
      body: notif.body,
      image_url: notif.image_url || '',
      target: notif.target
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderOrders = () => (
    <div className="animate-fade">
      <div className="page-header">
        <h2 className="page-title">Gestão de Pedidos</h2>
        <div style={{display: 'flex', gap: '8px'}}>
           <button className="btn-secondary" onClick={fetchAllData}><RefreshCw size={18}/> Atualizar</button>
        </div>
      </div>
      <div className="card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Cliente</th><th>Entregador</th><th>Mercado</th><th>Total</th><th>Status</th><th>Ação</th></tr>
            </thead>
            <tbody>
              {dbOrders.map(o => (
                <tr key={o.id}>
                  <td><strong>#{o.id.slice(0,4)}</strong></td>
                  <td>{o.client?.first_name} {o.client?.last_name?.[0]}.</td>
                  <td>{o.courier ? `${o.courier.first_name} ${o.courier.last_name?.[0]}.` : '--'}</td>
                  <td>{o.market?.name}</td>
                  <td>R$ {o.total_amount}</td>
                  <td><span className={`status-badge ${o.status === 'entregue' ? 'success' : 'info'}`}>{o.status}</span></td>
                  <td><button className="btn-icon" onClick={() => setSelectedOrder(o)}><Search size={18}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCouriers = () => (
    <div className="animate-fade">
      <div className="page-header">
        <h2 className="page-title">Entregadores</h2>
        <p style={{margin: 0, color: '#64748B'}}>Gerencie o cadastro e aprovação dos shoppers.</p>
      </div>
      <div className="card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr><th>Nome</th><th>Veículo</th><th>Cidade</th><th>Documentos</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {dbCouriers.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.first_name} {c.last_name}</strong></td>
                  <td>{c.info?.vehicle_type || '--'}</td>
                  <td>{c.info?.city} - {c.info?.state}</td>
                  <td>
                    <div style={{display: 'flex', gap: '4px'}}>
                      <button className="btn-icon" title="Ver Frente" onClick={() => window.open(c.info?.front_doc_url)}><ImageIcon size={16}/></button>
                      <button className="btn-icon" title="Ver Verso" onClick={() => window.open(c.info?.back_doc_url)}><ImageIcon size={16}/></button>
                    </div>
                  </td>
                  <td><span className={`status-badge ${c.status === 'ativo' ? 'success' : 'warning'}`}>{c.status}</span></td>
                  <td>
                    <div className="action-group">
                      <button className="btn-icon success" title="Aprovar" onClick={() => handleAction('Aprovar ' + c.first_name)}><Check size={18}/></button>
                      <button className="btn-icon danger" title="Bloquear"><ShieldAlert size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMarkets = () => (
    <div className="animate-fade">
      <div className="page-header">
        <h2 className="page-title">Mercados Parceiros</h2>
        <button className="btn-primary-admin">+ Novo Mercado</button>
      </div>
      <div className="metrics-grid">
         {dbMarkets.map(m => (
           <div className="card" key={m.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <h3 style={{margin: 0}}>{m.name}</h3>
                <p style={{fontSize: '12px', color: '#64748B', margin: '4px 0'}}>{m.address}</p>
                <span className="status-badge success">{m.status}</span>
              </div>
              <button className="btn-icon"><Settings size={18}/></button>
           </div>
         ))}
      </div>
    </div>
  );

  const renderFinance = () => (
    <div className="animate-fade">
      <div className="page-header">
        <h2 className="page-title">Logs Financeiros</h2>
      </div>
      <div className="card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr><th>Transação</th><th>Pedido</th><th>Valor Total</th><th>Split Admin</th><th>Split Courier</th><th>Status</th></tr>
            </thead>
            <tbody>
              {dbPayments.map(p => (
                <tr key={p.id}>
                  <td><small>{p.transaction_id || p.id.slice(0,8)}</small></td>
                  <td>#{p.order?.id.slice(0,4)}</td>
                  <td>R$ {p.amount}</td>
                  <td style={{color: '#166534', fontWeight: 'bold'}}>+ R$ {p.split_platform}</td>
                  <td>R$ {p.split_courier}</td>
                  <td><span className="status-badge success">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h2 className="page-title">Gestão de Notificações</h2>
          <p style={{margin: 0, color: '#64748B', fontSize: '14px'}}>Envie anúncios e alertas via Push para os usuários.</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Formulário de Criação */}
        <div className="card">
          <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '16px'}}>Criar Novo Alerta</h3>
          <form onSubmit={handleSendNotification}>
            <div className="form-group">
              <label>Título da Notificação</label>
              <input 
                type="text" 
                placeholder="Ex: Cupom de 20% ativo! 🎫" 
                value={notifForm.title}
                onChange={e => setNotifForm({...notifForm, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Mensagem (Corpo)</label>
              <textarea 
                placeholder="Escreva o conteúdo da mensagem..." 
                rows="3"
                value={notifForm.body}
                onChange={e => setNotifForm({...notifForm, body: e.target.value})}
                required
                style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0'}}
              ></textarea>
            </div>
            <div className="form-group">
              <label>URL da Imagem (Opcional)</label>
              <input 
                type="text" 
                placeholder="https://exemplo.com/imagem.png" 
                value={notifForm.image_url}
                onChange={e => setNotifForm({...notifForm, image_url: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Público-Alvo</label>
              <select 
                value={notifForm.target}
                onChange={e => setNotifForm({...notifForm, target: e.target.value})}
                className="input-field"
                style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0'}}
              >
                <option value="all">Todos os Usuários</option>
                <option value="couriers">Apenas Entregadores</option>
                <option value="clients">Apenas Clientes</option>
              </select>
            </div>
            <button className="btn-primary-admin" type="submit" disabled={isSending}>
              {isSending ? 'Enviando...' : <><Send size={18} /> Disparar Agora</>}
            </button>
          </form>
        </div>

        {/* Histórico */}
        <div className="card">
          <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '16px'}}>Histórico Recente</h3>
          <div className="notification-history-list">
            {isLoadingHistory ? (
              <p>Carregando histórico...</p>
            ) : notifHistory.length === 0 ? (
              <p style={{color: '#64748B'}}>Nenhuma notificação enviada ainda.</p>
            ) : (
              notifHistory.map(n => (
                <div key={n.id} className="history-item">
                  <div className="history-info">
                    <strong>{n.title}</strong>
                    <p>{n.body}</p>
                    <div className="history-meta">
                      <span><Clock size={12} /> {new Date(n.sent_at).toLocaleDateString()}</span>
                      <span><Users size={12} /> {n.target}</span>
                    </div>
                  </div>
                  <button className="btn-icon" title="Repostar" onClick={() => reuseNotification(n)}>
                    <RefreshCw size={18} color="#0B3D2E" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-container">
      {/* Overlay Mobile */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
             PegaFrete <span className="badge">Admin</span>
          </div>
          <button className="mobile-close-btn" onClick={closeSidebar}><X size={24}/></button>
        </div>
        
        <nav className="admin-nav">
          <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => {setActiveTab('dashboard'); closeSidebar();}}>
            <LayoutDashboard size={20} /> Visão Geral
          </button>
          <button className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => {setActiveTab('users'); closeSidebar();}}>
            <Users size={20} /> Usuários
          </button>
          <button className={`admin-nav-item ${activeTab === 'couriers' ? 'active' : ''}`} onClick={() => {setActiveTab('couriers'); closeSidebar();}}>
            <Bike size={20} /> Entregadores
          </button>
          <button className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => {setActiveTab('orders'); closeSidebar();}}>
            <ShoppingBag size={20} /> Gestão de Pedidos
          </button>
          <button className={`admin-nav-item ${activeTab === 'markets' ? 'active' : ''}`} onClick={() => {setActiveTab('markets'); closeSidebar();}}>
            <Store size={20} /> Mercados
          </button>
          <button className={`admin-nav-item ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => {setActiveTab('finance'); closeSidebar();}}>
            <Wallet size={20} /> Logs Financeiros
          </button>
          <button className={`admin-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => {setActiveTab('notifications'); closeSidebar();}}>
            <Bell size={20} /> Notificações
          </button>
          <button className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => {setActiveTab('settings'); closeSidebar();}}>
            <Settings size={20} /> Configurações
          </button>
        </nav>

        <div className="admin-logout">
          <button className="btn-logout" onClick={() => navigate('/onboarding')}>
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="admin-main">
        <header className="admin-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', flex: 1}}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            
            <div className="header-search-container">
              <div className={`header-search ${searchFocused ? 'focused' : ''}`}>
                <Search size={18} color="#94A3B8" />
                <input 
                  type="text" 
                  placeholder="Buscar ID, usuário, mercado..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                />
              </div>
              {/* Resultados de Busca Mockados */}
              {searchFocused && searchQuery.length > 2 && (
                <div className="search-dropdown">
                   <div className="search-item" onClick={() => alert('Ir para pedido #8892')}>
                      <div className="search-item-icon"><Package size={18}/></div>
                      <div className="search-item-info">
                         <strong>Pedido #8892</strong>
                         <span>João S. - R$ 145,90</span>
                      </div>
                   </div>
                   <div className="search-item" onClick={() => alert('Ir para usuário')}>
                      <div className="search-item-icon"><Users size={18}/></div>
                      <div className="search-item-info">
                         <strong>João Silva</strong>
                         <span>Cliente - ativo</span>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="header-user">
            <button className="btn-icon" style={{position: 'relative'}} onClick={() => alert('Notificações de sistema')}>
              <Bell size={20} color="#334155" />
              <span style={{position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%'}}></span>
            </button>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #E2E8F0', paddingLeft: '16px'}}>
              <div style={{width: '36px', height: '36px', borderRadius: '50%', background: '#0B3D2E', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                AD
              </div>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span style={{fontSize: '14px', fontWeight: 'bold', color: '#0F172A', lineHeight: 1.2}}>Super Admin</span>
                <span style={{fontSize: '12px', color: '#64748B'}}>Operações</span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'couriers' && renderCouriers()}
          {activeTab === 'markets' && renderMarkets()}
          {activeTab === 'finance' && renderFinance()}
        </div>
      </main>

      {/* Global Modals */}
      <OrderModal />
    </div>
  );
}
