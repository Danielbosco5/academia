
import React, { useState } from 'react';
import { Ban, Search, ShieldCheck, ShieldAlert, UserX } from 'lucide-react';
import { Student } from '../types';

interface BlockManagementProps {
  students: Student[];
  onToggleBlock: (cpf: string) => void;
}

const BlockManagement: React.FC<BlockManagementProps> = ({ students, onToggleBlock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const blockedOnly = true; // Based on UI context usually

  const filtered = students.filter(s => 
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.cpf.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Bloqueios</h2>
          <p className="text-gray-500">Bloqueie ou libere o acesso dos servidores.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por nome ou CPF..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(student => (
          <div key={student.id} className={`bg-white rounded-xl border p-6 transition-all ${student.blocked ? 'border-red-100 shadow-sm' : 'border-gray-100 shadow-none'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${student.blocked ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                {student.blocked ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-md ${student.blocked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {student.blocked ? 'Bloqueado' : 'Ativo'}
              </span>
            </div>
            
            <h4 className="font-bold text-gray-800 text-lg mb-1">{student.name}</h4>
            <p className="text-sm text-gray-500 mb-4">CPF: {student.cpf}</p>
            
            <button 
              onClick={() => onToggleBlock(student.cpf)}
              className={`w-full py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                student.blocked 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              }`}
            >
              {student.blocked ? (
                <>
                  <ShieldCheck size={18} />
                  Desbloquear Acesso
                </>
              ) : (
                <>
                  <UserX size={18} />
                  Bloquear Aluno
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-20 text-center">
          <Ban className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">Nenhum aluno encontrado para os critérios de busca.</p>
        </div>
      )}
    </div>
  );
};

export default BlockManagement;
