
import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { User, UserRole } from '../types';
import { ShieldCheck, UserPlus, Key, Edit, Trash2, Mail, UserCog, GraduationCap, X, Check, AlertCircle, Loader2 } from 'lucide-react';

const SystemUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      if (editingUser.id) {
        await userService.update(editingUser.id, editingUser);
        setMessage({ text: 'Usuário atualizado com sucesso!', type: 'success' });
      } else {
        await userService.create(editingUser);
        setMessage({ text: 'Novo usuário criado!', type: 'success' });
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (err: any) {
      setMessage({ text: err.message || 'Erro ao salvar usuário.', type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.id || !newPassword) return;

    try {
      await userService.resetPassword(editingUser.id, newPassword);
      setMessage({ text: 'Senha redefinida com sucesso!', type: 'success' });
      setIsResetModalOpen(false);
      setNewPassword('');
    } catch (err: any) {
      setMessage({ text: err.message || 'Erro ao redefinir senha.', type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este acesso?')) return;
    try {
      await userService.delete(id);
      loadUsers();
    } catch (err) { alert('Erro ao remover.'); }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="font-bold text-xs uppercase tracking-widest">Carregando permissões...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Gestão de Acesso</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Controle de Administradores e Professores</p>
        </div>
        <button 
          onClick={() => { setEditingUser({ role: UserRole.TEACHER }); setIsModalOpen(true); }}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 flex items-center gap-2 hover:bg-emerald-700 transition-all"
        >
          <UserPlus size={18} /> Novo Usuário
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-900 text-white' : 'bg-red-900 text-white'}`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <p className="font-bold text-xs uppercase">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${user.role === UserRole.ADMIN ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                {user.role === UserRole.ADMIN ? <UserCog size={28} /> : <GraduationCap size={28} />}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${user.role === UserRole.ADMIN ? 'bg-emerald-950 text-emerald-400' : 'bg-blue-950 text-blue-400'}`}>
                {user.role}
              </span>
            </div>

            <h4 className="text-lg font-black text-slate-800 mb-1">{user.name}</h4>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 lowercase">
                <Mail size={14} /> {user.email}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                CPF: {user.cpf}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex gap-1">
                <button 
                  onClick={() => { setEditingUser(user); setIsModalOpen(true); }}
                  className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                  title="Editar Perfil"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => { setEditingUser(user); setIsResetModalOpen(true); }}
                  className="p-2.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                  title="Redefinir Senha"
                >
                  <Key size={18} />
                </button>
              </div>
              <button 
                onClick={() => handleDelete(user.id)}
                className="p-2.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Remover Acesso"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Criar/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-emerald-600 text-white flex justify-between items-center">
              <h3 className="font-black uppercase tracking-widest text-sm">{editingUser?.id ? 'Editar Usuário' : 'Novo Usuário'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveUser} className="p-8 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Nome Completo</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm focus:border-emerald-500" value={editingUser?.name || ''} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">E-mail Institucional</label>
                  <input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm focus:border-emerald-500" value={editingUser?.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                </div>
                {!editingUser?.id && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">CPF</label>
                    <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm focus:border-emerald-500" value={editingUser?.cpf || ''} onChange={e => setEditingUser({...editingUser, cpf: e.target.value})} />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Cargo / Função</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm focus:border-emerald-500" value={editingUser?.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})}>
                    <option value={UserRole.ADMIN}>Administrador</option>
                    <option value={UserRole.TEACHER}>Professor</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-50 uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all">
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reset Senha */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-orange-600 text-white flex justify-between items-center">
              <h3 className="font-black uppercase tracking-widest text-sm">Redefinir Senha</h3>
              <button onClick={() => setIsResetModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleResetPassword} className="p-8 space-y-5 text-center">
              <p className="text-xs text-slate-500 font-medium">Defina uma nova senha para o acesso de <span className="font-black text-slate-800">{editingUser?.name}</span>.</p>
              <input 
                required 
                autoFocus
                placeholder="Nova Senha"
                className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-black text-lg text-center focus:border-orange-500" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
              />
              <button type="submit" className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg uppercase tracking-widest text-xs hover:bg-orange-700 transition-all">
                Confirmar Nova Senha
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemUsers;
