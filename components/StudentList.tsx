
import React, { useState } from 'react';
/* Added Clock to the imported icons from lucide-react */
import { Search, Trash2, Building, Phone, ShieldAlert, ShieldCheck, Dumbbell, Activity, Music, Clock } from 'lucide-react';
import { Student, Modality } from '../types';

interface StudentListProps {
  students: Student[];
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

const StudentList: React.FC<StudentListProps> = ({ students, onDelete, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cpf.includes(searchTerm)
  );

  const modalities = [
    { type: Modality.ACADEMIA, icon: Dumbbell, color: 'emerald' },
    { type: Modality.FUNCIONAL, icon: Activity, color: 'green' },
    { type: Modality.DANCA, icon: Music, color: 'teal' }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-emerald-950 uppercase tracking-tight leading-none">Matriculados</h2>
          <p className="text-emerald-600 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1">Gestão de Turmas Ativas</p>
        </div>
        
        <div className="relative group w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
          <input 
            type="text"
            placeholder="Nome ou CPF..."
            className="pl-11 pr-4 py-3 border-2 border-emerald-50 rounded-xl w-full md:w-80 focus:border-emerald-500 outline-none transition-all shadow-sm font-bold text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-10">
        {modalities.map(mod => {
          const modStudents = filteredStudents.filter(s => s.modality === mod.type);
          if (modStudents.length === 0 && searchTerm) return null;

          return (
            <section key={mod.type} className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className={`p-2 rounded-lg bg-${mod.color}-100 text-${mod.color}-700`}>
                  <mod.icon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-800 uppercase tracking-tight leading-none">{mod.type}</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{modStudents.length} Servidores</p>
                </div>
              </div>

              <div className={`bg-white rounded-[1.5rem] border border-${mod.color}-50 shadow-lg overflow-hidden`}>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left min-w-[700px]">
                    <thead>
                      <tr className="bg-emerald-950 text-emerald-400 text-[9px] uppercase font-black tracking-widest">
                        <th className="px-5 py-4">Servidor</th>
                        <th className="px-5 py-4">Lotação</th>
                        <th className="px-5 py-4">Horário</th>
                        <th className="px-5 py-4">Acesso</th>
                        {isAdmin && <th className="px-5 py-4 text-center">Ação</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-50">
                      {modStudents.map(student => (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm ${student.blocked ? 'bg-red-50 text-red-600' : `bg-${mod.color}-50 text-${mod.color}-700`}`}>
                                {student.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-gray-800 text-xs truncate max-w-[150px]">{student.name}</p>
                                <p className="text-[9px] text-emerald-600 font-bold font-mono">CPF {student.cpf}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase truncate max-w-[120px]">
                              <Building size={12} className="shrink-0" />
                              {student.department}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className={`flex items-center gap-1.5 text-${mod.color}-700 font-black text-[10px] uppercase`}>
                              <Clock size={12} className="shrink-0" />
                              {student.trainingTime}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {student.blocked ? (
                              <span className="bg-red-50 text-red-600 text-[8px] font-black px-2 py-1 rounded-md border border-red-100 uppercase">Bloqueado</span>
                            ) : (
                              <span className="bg-emerald-50 text-emerald-700 text-[8px] font-black px-2 py-1 rounded-md border border-emerald-100 uppercase">Ativo</span>
                            )}
                          </td>
                          {isAdmin && (
                            <td className="px-5 py-4 text-center">
                              <button onClick={() => onDelete(student.id)} className="p-2 text-emerald-100 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default StudentList;
