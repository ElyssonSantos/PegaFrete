# 📱 Relatório Completo: PegaFrete Mercado
*Data de Emissão: 13/04/2026*

Este documento fornece uma análise detalhada da arquitetura, estrutura de arquivos e funcionalidades do ecossistema PegaFrete Mercado.

---

## 🏗️ 1. Visão Geral do Aplicativo

O **PegaFrete Mercado** é uma plataforma SaaS de logística de "última milha" focada em compras de supermercado sob demanda. Ele conecta três grupos principais:
1.  **Clientes:** Solicitam listas de compras e acompanham a entrega.
2.  **Entregadores (Shoppers):** Aceitam pedidos, realizam a compra física e entregam ao destino.
3.  **Administradores:** Gerenciam a saúde financeira, aprovações de usuários, taxas e comunicação em massa.

### Stack Tecnológica
- **Frontend:** React 18 + Vite (Performance e modernidade).
- **Backend/BAAS:** Supabase (PostgreSQL, Auth, Realtime, Edge Functions).
- **Notificações:** Firebase Cloud Messaging (FCM) para alertas push.
- **Design:** CSS Vanilla customizado com foco em UX mobile-first e temas "Premium".
- **Ícones:** Lucide React.

---

## 📂 2. Inventário e Análise de Arquivos

### 🌐 Raiz do Projeto
| Arquivo | Função | Detalhes |
| :--- | :--- | :--- |
| `index.html` | Entry Point HTML | Contém os scripts fundamentais e viewport para mobile. |
| `package.json` | Manifest de Dependências | Define scripts (`dev`, `build`) e libs (Supabase, Firebase, React Router). |
| `vite.config.js` | Configuração de Build | Otimização do bundle e plugins (React, PWA). |
| `schema.sql` | Blueprint do Banco | SQL completo das tabelas (Users, Orders, Tracking, Payments). |
| `.env.local` | Segredos (Local) | Chaves de API do Supabase e Firebase (Não versionado). |
| `vercel.json` | Deploy | Configurações para hospedagem na Vercel (Single Page App). |

### 🎨 Design System e Core (`src/`)
| Arquivo | Função | Detalhes |
| :--- | :--- | :--- |
| `main.jsx` | Inicializador React | Renderiza o App dentro da StrictMode. |
| `App.jsx` | Router & Notificações | Centraliza as rotas e o contexto de Toasts de notificação. |
| `index.css` | Design System Global | Variáveis de cores (`#0D4A38` verde corporativo), resets e classes utilitárias. |

### 📄 Páginas (`src/pages/`)
| Arquivo | Função | Detalhes |
| :--- | :--- | :--- |
| `Onboarding.jsx` | Tutorial de Entrada | Slides interativos com animações para retenção de usuários. |
| `SignupSteps.jsx` | Cadastro Híbrido | Fluxo inteligente que separa Cliente de Entregador (Coleta de docs). |
| `ClientDashboard.jsx` | Hub do Cliente | Gestão de pedidos, feed de ofertas e rastreamento de entregas. |
| `CourierDashboard.jsx` | Hub do Entregador | Mapa de pedidos próximos, radar e carteira de ganhos. |
| `AdminDashboard.jsx` | Torre de Controle | Painel gigante com métricas reais, gestão de usuários e envio de Push. |
| `DebugNotifications.jsx` | Ferramenta Interna | Utilidade para validar tokens e recebimento de mensagens push. |

### 🛠️ Componentes, Hooks e Libs
| Arquivo | Função | Detalhes |
| :--- | :--- | :--- |
| `lib/supabase.js` | Conector Supabase | Configura a instância única para comunicação com banco e auth. |
| `lib/firebase.js` | Conector Firebase | Configura o Messaging para tokens de notificação. |
| `hooks/useNotifications.js` | Lógica de Notificação | Hook customizado para registrar Service Workers e capturar notificações. |
| `components/NotificationToast.jsx` | UI de Alerta | Componente flutuante premium para exibir feedback ao usuário. |

---

## 🗄️ 3. Arquitetura de Dados (Database Schema)

O banco de dados PostgreSQL (via Supabase) foi projetado para auditoria e escalabilidade:
- **`users`:** Armazena perfis e papéis (roles).
- **`orders` & `order_items`:** Suporta pedidos com múltiplos itens, marcas preferenciais e fotos.
- **`delivery_tracking`:** Registra coordenadas GPS históricas para segurança do trajeto.
- **`payments` & `finance`:** Controla o split de pagamento (Plataforma vs. Entregador).
- **`notification_history`:** Log de todos os disparos de broadcast realizados pelo admin.

---

## 📡 4. Ecossistema de Mensageria

O projeto implementa uma solução robusta de **Push Notifications**:
1.  **Client-Side:** `firebase-messaging-sw.js` (em `/public`) lida com mensagens em segundo plano.
2.  **Server-Side:** Scripts como `enviar-teste.cjs` usam `google-auth-library` para autenticar na API V1 do Firebase.
3.  **Interface Admin:** Permite disparar mensagens segmentadas (Todos, Apenas Drivers, Apenas Clientes).

---

## 🚀 5. Estado Atual e Próximos Passos

O aplicativo está em estágio **Beta Avançado**.
- ✅ **UI/UX:** Totalmente implementada e otimizada para mobile e desktop.
- ✅ **Database:** Esquema finalizado e integrado.
- ✅ **Notificações:** Infraestrutura de Push configurada e funcional.
- 🚧 **Pagamentos:** Estrutura pronta, aguardando integração com API de Gateway (ex: Pagar.me).
- 🚧 **Geolocalização:** Lógica de radar implementada, falta integração com Mapbox/Google Maps API real para roteamento dinâmico.

---
**Relatório gerado por Antigravity.**
*Fim do documento.*
