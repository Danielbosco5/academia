
import React, { useState } from 'react';
import { ShieldCheck, UserCog, GraduationCap, Lock, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const passwords = {
    [UserRole.ADMIN]: 'admin2025',
    [UserRole.TEACHER]: 'professor2025'
  };

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole && password === passwords[selectedRole]) {
      const mockUser: User = {
        id: selectedRole === UserRole.ADMIN ? 'u1' : 't1',
        name: selectedRole === UserRole.ADMIN ? 'Administrador Central' : 'Professor Instrutor',
        email: selectedRole === UserRole.ADMIN ? 'admin@gestao.go.gov.br' : 'professor@gestao.go.gov.br',
        cpf: '000.000.000-00',
        role: selectedRole,
        active: true
      };
      onLogin(mockUser);
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  const resetSelection = () => {
    setSelectedRole(null);
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Lock size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academia <span className="text-emerald-600">GO</span></h1>
          </div>
          <h2 className="text-4xl font-black text-slate-800 leading-tight">Sistema de Gestão Esportiva do Servidor</h2>
          <p className="text-slate-500 text-lg">Bem-vindo ao portal oficial. Selecione o seu perfil e utilize sua senha de acesso.</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 min-h-[400px] flex flex-col justify-center">
          {!selectedRole ? (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-800 mb-6 text-center">Quem está acessando?</h3>
              
              <button 
                onClick={() => setSelectedRole(UserRole.ADMIN)}
                className="w-full group bg-slate-50 p-6 rounded-2xl border-2 border-transparent hover:border-emerald-500 transition-all text-left flex items-center gap-6"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-emerald-600 shadow-sm transition-colors">
                  <UserCog size={28} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Administrador</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium italic">Gestão e Matrículas</p>
                </div>
              </button>

              <button 
                onClick={() => setSelectedRole(UserRole.TEACHER)}
                className="w-full group bg-slate-50 p-6 rounded-2xl border-2 border-transparent hover:border-emerald-500 transition-all text-left flex items-center gap-6"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-emerald-600 shadow-sm transition-colors">
                  <GraduationCap size={28} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Professor</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium italic">Frequência e Alunos</p>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleLoginAttempt} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <button 
                type="button" 
                onClick={resetSelection}
                className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition-colors mb-4"
              >
                <ArrowLeft size={16} /> Voltar à seleção
              </button>

              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4 ${selectedRole === UserRole.ADMIN ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                  {selectedRole === UserRole.ADMIN ? <UserCog size={40} /> : <GraduationCap size={40} />}
                </div>
                <h3 className="text-xl font-black text-slate-800">Acesso {selectedRole}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Informe sua senha abaixo</p>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    autoFocus
                    type="password"
                    placeholder="Sua senha secreta"
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none font-bold transition-all ${error ? 'border-red-500 focus:ring-red-100' : 'border-slate-100 focus:border-emerald-500 focus:ring-emerald-100'} focus:ring-4`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-widest px-2">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all uppercase tracking-[0.2em] text-sm"
              >
                Entrar no Sistema
              </button>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[9px] text-slate-400 font-bold uppercase text-center leading-relaxed">
                  Dica: Senhas padrões para teste:<br/>
                  <span className="text-emerald-600">Admin: admin2025</span> | <span className="text-blue-600">Prof: professor2025</span>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
