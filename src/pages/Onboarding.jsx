import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import './Onboarding.css';

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Mais tempo real para sua vida',
    subtitle: 'Nós vamos ao supermercado para que você possa curtir sua família e descansar.',
    icon: <ShoppingBag size={80} color="var(--primary-color)" strokeWidth={1.5} />,
    btnText: 'Começar agora'
  },
  {
    id: 2,
    title: 'Seus produtos favoritos, sempre',
    subtitle: 'Conectado aos melhores supermercados da cidade. Marcas líderes e preços de prateleira.',
    icon: (
      <div className="product-showcase">
        <div className="card product-card animate-slide-up shadow-sm" style={{animationDelay: '0.1s'}}>🍎 Hortifruti Fresco</div>
        <div className="card product-card animate-slide-up shadow-sm" style={{animationDelay: '0.2s'}}>🥩 Carnes Selecionadas</div>
        <div className="card product-card animate-slide-up shadow-sm" style={{animationDelay: '0.3s'}}>🥤 Bebidas Geladas</div>
      </div>
    ),
    btnText: 'Avançar'
  },
  {
    id: 3,
    title: 'Mais de 10.000 entregas realizadas',
    subtitle: 'Nossos clientes nos avaliam com 4.9 estrelas na sua região.',
    icon: (
      <div className="social-proof-icon">
        <Star size={80} color="var(--warning)" fill="var(--warning)" />
        <div className="floating-badge">4.9/5</div>
      </div>
    ),
    btnText: 'Avançar'
  },
  {
    id: 4,
    title: 'Segurança em Primeiro Lugar',
    subtitle: 'Entregadores 100% verificados e pagamentos apenas via plataforma. Nenhuma surpresa na sua porta.',
    icon: <ShieldCheck size={80} color="var(--primary-color)" strokeWidth={1.5} />,
    trusted: true,
    btnText: 'Criar minha conta'
  }
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/signup');
    }
  };

  const handleLogin = () => {
    navigate('/client');
  };

  const currentStep = ONBOARDING_STEPS[step];

  return (
    <div className="onboarding-container">
      <div className="onboarding-image-area">
        <div className="onboarding-icon animate-fade-in" key={currentStep.id}>
          {currentStep.icon}
        </div>
      </div>
      
      <div className="onboarding-content animate-slide-up" key={`content-${currentStep.id}`}>
        <div className="dots-container">
          {ONBOARDING_STEPS.map((_, i) => (
            <div key={i} className={`dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>
        
        <h1 className="onboarding-title">{currentStep.title}</h1>
        <p className="onboarding-subtitle">{currentStep.subtitle}</p>

        {currentStep.trusted && (
           <div className="trusted-badges mb-4">
             <div className="badge-item"><CheckCircle2 size={16} color="var(--success)"/> Entregadores verificados</div>
             <div className="badge-item"><CheckCircle2 size={16} color="var(--success)"/> Pagamento em ambiente blindado</div>
           </div>
        )}
        
        <div className="button-group mt-auto flex-col gap-3">
          <button className="btn btn-primary btn-scale shadow-lg" onClick={handleNext}>
            {currentStep.btnText}
            {step < ONBOARDING_STEPS.length - 1 && <ChevronRight size={20} />}
          </button>
          {step === ONBOARDING_STEPS.length - 1 && (
            <button className="btn btn-outline btn-scale mt-3" style={{border: 'none', background: 'rgba(13, 74, 56, 0.05)'}} onClick={handleLogin}>
              Já tenho uma conta (Login)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
