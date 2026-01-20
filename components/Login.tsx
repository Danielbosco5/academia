
import React, { useState } from 'react';
import { UserCog, GraduationCap, Lock, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { User } from '../types';
import { userService } from '../services/userService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const user = await userService.authenticate(email, password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar. Verifique seus dados.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="bg-emerald-600 p-10 text-center text-white relative">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Lock size={40} />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Academia <span className="text-emerald-950">GO</span></h1>
          <p className="text-emerald-100/80 text-sm font-bold uppercase tracking-widest mt-2">Portal do Colaborador</p>
          
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-emerald-600">
             <UserCog size={20} className="text-emerald-600" />
          </div>
        </div>

        <form onSubmit={handleLoginAttempt} className="p-10 pt-12 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">E-mail Institucional</label>
              <input 
                required
                type="email"
                placeholder="exemplo@gestao.go.gov.br"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold focus:border-emerald-500 transition-all text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Senha de Acesso</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold focus:border-emerald-500 transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 p-3 rounded-xl flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-widest animate-pulse">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button 
            disabled={isLoggingIn}
            type="submit"
            className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-[0.98] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            {isLoggingIn ? <><Loader2 className="animate-spin" size={18} /> Acessando...</> : 'Entrar no Sistema'}
          </button>

          <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed">
            Acesso restrito a servidores autorizados.<br/>
            Em caso de perda de senha, contate o Administrador TI.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
