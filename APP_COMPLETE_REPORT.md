# 📱 Documentação Mestra: PegaFrete Mercado

Este documento serve como o **Relatório Completo** de engenharia e produto para o aplicativo PegaFrete Mercado.

---

## 🏗️ 1. Estrutura do Projeto (File Tree)

```text
pegaFrete/
├── src/
│   ├── pages/
│   │   ├── Onboarding.jsx      # Fluxo de entrada e proposta de valor
│   │   ├── SignupSteps.jsx      # Cadastro multi-etapa (UX estilo Uber/iFood)
│   │   ├── ClientDashboard.jsx  # Hub principal do comprador
│   │   ├── CourierDashboard.jsx # Hub principal do entregador
│   │   └── (CSS correspondentes)
│   ├── App.jsx                 # Configuração de rotas (React Router)
│   ├── main.jsx                # Entry point do React
│   └── index.css               # Design System Global (Variáveis e Reset)
├── schema.sql                  # Modelagem do banco de dados PostgreSQL
├── package.json                # Dependências (React, Lucide, Vite)
└── vite.config.js              # Configuração de build
```

---

## 🔄 2. Fluxo de Experiência do Usuário (UX Roadmap)

### A. Onboarding & Conversão
- **Objetivo:** Retenção e educação do usuário.
- **Telas:** 4 slides interativos com ícones Lucide e animações de entrada (`animate-slide-up`).
- **Lógica:** O usuário conhece os benefícios antes de ser solicitado a criar uma conta.

### B. Cadastro Inteligente (Signup)
- **Persistência:** Uso de `localStorage` para não perder dados se a aba fechar.
- **Diferenciação:** O fluxo se divide na etapa 3 baseado no perfil (Cliente ou Entregador).
- **Segurança:** Etapa de envio de documentos (CNH/RG) exclusiva para entregadores.

### C. Ecossistema do Cliente (Mercado & Compra)
- **Dashboard:** Interface tabulada (Home, Ofertas, Pedidos, Perfil).
- **Novo Pedido:** Formulário dinâmico capaz de lidar com múltiplos itens, marcas ideais e limites de preço.
- **Rastreamento Hero:** Uma timeline "viva" que muda de estado conforme o entregador avança na vida real.

### D. Ecossistema do Entregador (Logística & Ganhos)
- **Modo Radar:** Efeito visual de pulso buscando pedidos próximos.
- **Navegação (GPS):** Modo de direção passo-a-passo integrado na interface, simulando a rota até o cliente.
- **Wallet:** Acompanhamento de ganhos acumulados no dia.

---

## 🗄️ 3. Especificações Técnicas (Backend & Data)

O banco de dados foi modelado para suportar operações complexas de "split" de pagamento e rastreamento histórico.

- **Integridade:** Uso de chaves estrangeiras vinculando Pedidos -> Itens -> Mercados.
- **Escalabilidade:** Tabela `delivery_tracking` pronta para armazenar milhares de pontos de GPS para revisões de segurança.
- **Status:** Sistema de estados robusto (`pendente`, `aguardando`, `em_rota`, `entregue`).

---

## 🎨 4. Design System & Identidade

- **Cores Identitárias:** 
  - Primária: `#0D4A38` (Verde Escuro - Segurança)
  - Accent: `#10B981` (Verde Esmeralda - Ação/Ganhos)
  - Background: `#F8FAFC` (Clean - Foco no produto)
- **Componentes:** Card-based UI, 3D shadows sutis e feedback tátil em botões (`btn-scale`).

---

## 🚀 5. Próxima Sprint: Conectividade Real

1.  **Auth Real:** Substituir o simulador de signup por `supabase.auth.signUp()`.
2.  **Storage:** Implementar upload real para fotos de produtos e documentos.
3.  **Real-Time:** Ativar o canal de Broadcast do Supabase para que o Cliente veja a mudança de status do Entregador instantaneamente sem reload.

---
**Relatório Gerado em:** 09/04/2026.
**Autor:** Antigravity (IA de Elite).
