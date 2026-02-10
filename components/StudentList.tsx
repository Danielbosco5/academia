
import React, { useState, useMemo } from 'react';
import { Search, Trash2, Clock, Edit3, X, Dumbbell, Activity, Music, Users, ChevronRight } from 'lucide-react';
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

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.cpf.includes(searchTerm)
    );
  }, [students, searchTerm]);

  const groupedByTime = useMemo(() => {
    const groups: Record<string, Record<string, Student[]>> = {};
    filteredStudents.forEach(s => {
      const time = s.trainingTime || 'Sem Horário';
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
      case Modality.ACADEMIA: return <Dumbbell size={12} />;
      case Modality.FUNCIONAL: return <Activity size={12} />;
      case Modality.DANCA: return <Music size={12} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Alunos Matriculados</h2>
          <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest mt-1">Organização Subdividida por Turmas A/B — {filteredStudents.length} servidor(es)</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar servidor..."
            className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-bold text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedByTime).map(([time, turmas]) => (
          <div key={time} className="space-y-4">
            <div className="flex items-center gap-3 bg-slate-100/50 p-4 rounded-2xl border border-slate-100">
              <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">{time}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Capacidade Máxima: 24 Alunos (12 por Turma)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {['Turma A', 'Turma B'].map(turmaName => {
                const groupStudents = turmas[turmaName] || [];
                return (
                  <div key={turmaName} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${turmaName === 'Turma A' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{turmaName}</span>
                      </div>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${groupStudents.length >= 12 ? 'bg-orange-100 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {groupStudents.length} / 12 VAGAS
                      </span>
                    </div>

                    <div className="flex-1">
                      {groupStudents.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                          {groupStudents.map(student => (
                            <div key={student.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs shrink-0 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                                  {student.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-800 text-xs truncate leading-none uppercase tracking-tight">{student.name}</p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[9px] text-slate-400 font-bold font-mono tracking-tighter">CPF {student.cpf}</span>
                                    <span className="text-slate-200">|</span>
                                    <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-black uppercase tracking-tighter">
                                      {getModalityIcon(student.modality)}
                                      {student.modality}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => setEditingStudent(student)}
                                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <Edit3 size={14} />
                                </button>
                                {isAdmin && (
                                  <button 
                                    onClick={() => onDelete(student.id)} 
                                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center">
                          <Users size={32} className="mx-auto text-slate-100 mb-2" />
                          <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Nenhuma Matrícula</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {editingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Edit3 size={20} className="text-emerald-500" />
                <h3 className="font-black uppercase tracking-widest text-sm">Editar Cadastro</h3>
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
