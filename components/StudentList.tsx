
import React, { useState, useMemo } from 'react';
import { Search, Trash2, Building, ShieldCheck, ShieldAlert, Dumbbell, Activity, Music, Clock, Edit3, X, Save, Loader2, Users } from 'lucide-react';
import { Student, Modality } from '../types';
import StudentForm from './StudentForm';

interface StudentListProps {
  students: Student[];
  onDelete: (id: string) => void;
  onUpdate: (student: Student) => Promise<void>;
  isAdmin: boolean;
}

const StudentList: React.FC<StudentListProps> = ({ students, onDelete, onUpdate, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filtra alunos baseados na busca
  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.cpf.includes(searchTerm)
    );
  }, [students, searchTerm]);

  // Agrupa alunos por horário e turma
  const groupedByTime = useMemo(() => {
    const groups: Record<string, Record<string, Student[]>> = {};
    
    filteredStudents.forEach(s => {
      const time = s.trainingTime || 'Não Definido';
      const turma = s.turma || 'Turma A';
      
      if (!groups[time]) groups[time] = {};
      if (!groups[time][turma]) groups[time][turma] = [];
      
      groups[time][turma].push(s);
    });

    return Object.keys(groups).sort().reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {} as Record<string, Record<string, Student[]>>);
  }, [filteredStudents]);

  const handleEditSave = async (updatedData: Student) => {
    setIsUpdating(true);
    try {
      await onUpdate(updatedData);
      setEditingStudent(null);
    } catch (err) {
      console.error("Falha ao atualizar aluno:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getModalityIcon = (modality: Modality) => {
    switch (modality) {
      case Modality.ACADEMIA: return <Dumbbell size={14} />;
      case Modality.FUNCIONAL: return <Activity size={14} />;
      case Modality.DANCA: return <Music size={14} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">Alunos Ativos</h2>
          <p className="text-emerald-600 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1">Organizado por Horário e Turmas (Limite 12)</p>
        </div>
        
        <div className="relative group w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por nome ou CPF..."
            className="pl-11 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl w-full md:w-80 focus:border-emerald-500 outline-none transition-all shadow-sm font-bold text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-16">
        {Object.entries(groupedByTime).map(([time, turmas]) => (
          <section key={time} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 px-2 border-l-4 border-slate-900 pl-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">{time}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {Object.values(turmas).flat().length} Servidores no Horário
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {['Turma A', 'Turma B'].map(turmaName => {
                const groupStudents = turmas[turmaName] || [];
                return (
                  <div key={turmaName} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">{turmaName}</h4>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${groupStudents.length >= 12 ? 'bg-orange-100 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {groupStudents.length} / 12 Alunos
                      </span>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden flex-1">
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left min-w-[500px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[9px] uppercase font-black tracking-widest">
                              <th className="px-6 py-4">Servidor</th>
                              <th className="px-6 py-4">Modalidade</th>
                              <th className="px-6 py-4 text-center">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {groupStudents.map(student => (
                              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group text-sm">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs">
                                      {student.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-bold text-slate-800 truncate max-w-[140px] leading-none">{student.name}</p>
                                      <p className="text-[9px] text-slate-400 font-bold font-mono mt-1">CPF {student.cpf}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-lg w-fit">
                                    <span className="text-slate-600">{getModalityIcon(student.modality)}</span>
                                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter">{student.modality}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex justify-center gap-1">
                                    <button 
                                      onClick={() => setEditingStudent(student)}
                                      className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    {isAdmin && (
                                      <button 
                                        onClick={() => onDelete(student.id)} 
                                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {groupStudents.length === 0 && (
                              <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-slate-300 italic text-[10px] font-bold uppercase tracking-widest">
                                  Nenhum servidor matriculado na {turmaName} deste horário.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {editingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Edit3 size={20} className="text-emerald-500" />
                <h3 className="font-black uppercase tracking-widest text-sm">Editar Cadastro do Servidor</h3>
              </div>
              <button onClick={() => setEditingStudent(null)} className="p-2 hover:bg-white/10 rounded-xl"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <StudentForm 
                initialData={editingStudent} 
                onSave={handleEditSave} 
                students={students.filter(s => s.id !== editingStudent.id)}
                isSaving={isUpdating}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
