import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MapPin, Search, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './SignupSteps.css';

const CIDADES_SE = ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'São Cristóvão', 'Estância'];

export default function SignupSteps() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    vehicle: '',
    state: 'SE',
    city: '',
    profile: '',
    gender: '',
    cpf: '',
    cep: '',
    discovery: ''
  });

  // Persistência local (simulando salvamento automático da Uber)
  useEffect(() => {
    const saved = localStorage.getItem('pegafrete_signup');
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const newData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newData);
    localStorage.setItem('pegafrete_signup', JSON.stringify(newData));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
    else navigate('/onboarding');
  };

  const finishSignup = async () => {
    setLoading(true);
    try {
      // 1. Criar Auth User no Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: 'Password123!', // Senha padrão para este teste ou podemos pedir no form
        options: {
          data: {
            first_name: formData.firstName,
            role: formData.profile
          }
        }
      });

      if (authError) throw authError;

      // 2. Inserir na tabela pública de usuários (Geralmente feito via trigger, mas mantendo o código se necessário)
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: formData.email,
          phone: formData.phone,
          first_name: formData.firstName,
          last_name: formData.lastName,
          birth_date: formData.birthDate,
          role: formData.profile,
          status: formData.profile === 'entregador' ? 'pendente' : 'ativo'
        }]);

      if (userError) throw userError;

      // 3. Se for entregador, salvar informações adicionais
      if (formData.profile === 'entregador') {
        const { error: courierError } = await supabase
          .from('couriers_info')
          .insert([{
            user_id: authData.user.id,
            vehicle_type: formData.vehicle,
            state: formData.state,
            city: formData.city,
            gender: formData.gender,
            cpf: formData.cpf,
            cep: formData.cep,
            discovery_channel: formData.discovery
          }]);

        if (courierError) throw courierError;
      }

      // 4. Sucesso
      localStorage.removeItem('pegafrete_signup');
      setStep(6);
      setTimeout(() => {
        if(formData.profile === 'cliente') navigate('/client');
        else navigate('/courier');
      }, 3000);

    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao realizar cadastro: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        {step < 6 && (
          <button className="back-btn" onClick={prevStep}>
            <ArrowLeft size={24} color="#0B3D2E" />
          </button>
        )}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>
      </div>

      <div className="signup-content animate-slide-in-right" key={`step-${step}`}>
        {step === 1 && (
          <>
            <h2>Qual é o seu número de telefone e e-mail?</h2>
            <p>Usaremos para manter sua conta segura.</p>
            <div className="input-group" style={{marginTop: '32px'}}>
              <label className="input-label">Telefone celular</label>
              <input type="tel" name="phone" className="input-field" placeholder="(11) 90000-0000" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">E-mail</label>
              <input type="email" name="email" className="input-field" placeholder="seu@email.com" value={formData.email} onChange={handleChange} />
            </div>
            <button className="btn btn-primary mt-auto" onClick={nextStep} disabled={!formData.phone || !formData.email}>Avançar</button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Seus dados</h2>
            <div className="input-row">
              <div className="input-group" style={{flex: 1}}>
                <label className="input-label">Nome</label>
                <input type="text" name="firstName" className="input-field" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="input-group" style={{flex: 1}}>
                <label className="input-label">Sobrenome</label>
                <input type="text" name="lastName" className="input-field" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">E-mail</label>
              <input type="email" name="email" className="input-field disabled" disabled value={formData.email} />
            </div>
            <div className="input-group">
              <label className="input-label">Data de nascimento</label>
              <input type="date" name="birthDate" className="input-field" value={formData.birthDate} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">Carro ou moto?</label>
              <select name="vehicle" className="input-field" value={formData.vehicle} onChange={handleChange}>
                <option value="">Selecione...</option>
                <option value="carro">Carro</option>
                <option value="moto">Moto</option>
                <option value="bicicleta">Bicicleta</option>
                <option value="nenhum">Nenhum (Sou cliente)</option>
              </select>
            </div>
            <div className="input-row">
              <div className="input-group" style={{flex: 1}}>
                <label className="input-label">Estado</label>
                <select name="state" className="input-field disabled" disabled value="SE">
                  <option value="SE">Sergipe (Ativo)</option>
                </select>
              </div>
              <div className="input-group" style={{flex: 2}}>
                <label className="input-label">Cidade</label>
                <select name="city" className="input-field" value={formData.city} onChange={handleChange}>
                  <option value="">Selecione...</option>
                  {CIDADES_SE.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" onClick={nextStep}>Avançar</button>
          </>
        )}

        {step === 3 && (
          <>
            <h2>O que você quer fazer?</h2>
            <div className="profile-selector">
              <label className={`profile-card ${formData.profile === 'cliente' ? 'active' : ''}`}>
                <input type="radio" name="profile" value="cliente" onChange={handleChange} />
                <div className="profile-icon">🛒</div>
                <h3>Quero comprar</h3>
                <p>Compre sem sair de casa.</p>
              </label>
              <label className={`profile-card ${formData.profile === 'entregador' ? 'active' : ''}`}>
                <input type="radio" name="profile" value="entregador" onChange={handleChange} />
                <div className="profile-icon">🛵</div>
                <h3>Quero trabalhar</h3>
                <p>Seja separador ou entregador.</p>
              </label>
            </div>
            <button className="btn btn-primary mt-auto" onClick={nextStep} disabled={!formData.profile}>Avançar</button>
          </>
        )}

        {step === 4 && (
          <>
            <h2>Informações Adicionais</h2>
            <div className="input-group">
              <label className="input-label">Gênero</label>
              <select name="gender" className="input-field" value={formData.gender} onChange={handleChange}>
                <option value="">Selecione...</option>
                <option value="homem">Homem</option>
                <option value="mulher">Mulher</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">CPF</label>
              <input type="text" name="cpf" className="input-field" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">CEP</label>
              <div style={{position: 'relative'}}>
                <input type="text" name="cep" className="input-field" placeholder="00000-000" style={{paddingLeft: '48px'}} value={formData.cep} onChange={handleChange} />
                <MapPin size={20} color="#64748B" style={{position: 'absolute', left: '16px', top: '16px'}} />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Como nos conheceu?</label>
              <select name="discovery" className="input-field" value={formData.discovery} onChange={handleChange}>
                <option value="">Selecione...</option>
                <option value="instagram">Instagram</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="indicacao">Indicação</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={formData.profile === 'entregador' ? nextStep : finishSignup} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Finalizar'}
            </button>
          </>
        )}

        {step === 5 && formData.profile === 'entregador' && (
          <>
            <h2>Envio de Documentos</h2>
            <p>Tire uma foto clara do seu documento (CNH ou RG).</p>
            <div className="upload-container">
              <div className="upload-box">
                <Search size={32} color="#0B3D2E" />
                <span>Foto da FRENTE</span>
              </div>
              <div className="upload-box">
                <Search size={32} color="#0B3D2E" />
                <span>Foto do VERSO</span>
              </div>
            </div>
            <button className="btn btn-primary mt-auto" onClick={finishSignup} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Enviar para Análise'}
            </button>
          </>
        )}

        {step === 6 && (
          <div className="success-screen">
            <CheckCircle2 size={80} color="#10B981" />
            <h2>{formData.profile === 'entregador' ? 'Seu cadastro está em análise' : 'Tudo Certo!'}</h2>
            <p>{formData.profile === 'entregador' ? 'Avisaremos via e-mail e SMS assim que aprovar.' : 'Bem-vindo ao PegaFrete Mercado.'}</p>
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
}
