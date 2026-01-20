
import React, { useState } from 'react';
import { UserCog, Plus, Trash2, Mail, Hash, UserCheck, Shield } from 'lucide-react';
import { User, UserRole } from '../types';

interface TeacherManagementProps {
  teachers: User[];
  onAddTeacher: (teacher: User) => void;
  onRemoveTeacher: (id: string) => void;
}

const TeacherManagement: React.FC<TeacherManagementProps> = ({ teachers, onAddTeacher, onRemoveTeacher }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', cpf: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeacher: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      cpf: formData.cpf,
      role: UserRole.TEACHER,
      active: true
    };
    onAddTeacher(newTeacher);
    setFormData({ name: '', email: '', cpf: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="text-indigo-600" size={24} />
            Gestão de Professores
          </h2>
          <p className="text-gray-500">Cadastre e gerencie os perfis de acesso dos instrutores.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
        >
          {isAdding ? <><Trash2 size={20} /> Cancelar</> : <><Plus size={20} /> Novo Professor</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-2xl border border-indigo-100 shadow-xl animate-fade-in">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ex: Prof. Anderson Silva"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">E-mail Institucional</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="email@academia.gov.br"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">CPF</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={e => setFormData({...formData, cpf: e.target.value})}
                />
              </div>
              <button type="submit" className="bg-indigo-600 text-white p-3.5 rounded-xl hover:bg-indigo-700 shadow-lg">
                <UserCheck size={20} />
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(teacher => (
          <div key={teacher.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                {teacher.name.split(' ').pop()?.charAt(0)}
              </div>
              <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                Professor
              </div>
            </div>
            
            <h4 className="text-lg font-bold text-gray-800 mb-1">{teacher.name}</h4>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail size={14} /> {teacher.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Hash size={14} /> CPF: {teacher.cpf}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-end">
              <button 
                onClick={() => onRemoveTeacher(teacher.id)}
                className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Remover Professor"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {teachers.length === 0 && (
        <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <UserCog className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">Nenhum professor cadastrado no sistema.</p>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
