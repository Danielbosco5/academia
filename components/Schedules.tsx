
import React, { useMemo } from 'react';
import { Calendar, Clock, MapPin, Info, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Student, Modality } from '../types';

interface SchedulesProps {
  students: Student[];
}

const Schedules: React.FC<SchedulesProps> = ({ students }) => {
  const getOccupancy = (modality: Modality, days: string, time: string, turma: string) => {
    return students.filter(s => 
      !s.onWaitlist && 
      s.modality === modality && 
      s.trainingDays === days && 
      s.trainingTime.startsWith(time.split(' ')[0]) &&
      (s.turma === turma || (!s.turma && turma === 'Turma A'))
    ).length;
  };

  const activities = [
    {
      name: Modality.ACADEMIA,
      color: 'bg-emerald-600',
      description: 'Treinamento de força e musculação.',
      schedule: [
        { days: 'Segunda, Quarta e Sexta', times: ['06h', '07h', '11h', '12h', '13h', '16h (Limpeza)', '17h', '18h', '19h'] },
        { days: 'Terça e Quinta', times: ['06h', '07h', '11h', '12h', '13h', '17h', '18h', '19h'] },
      ]
    },
    {
      name: Modality.FUNCIONAL,
      color: 'bg-blue-600',
      description: 'Exercícios dinâmicos de alta intensidade.',
      schedule: [
        { days: 'Segunda, Quarta e Sexta', times: ['07h10', '11h10', '17h10', '18h'] },
      ]
    },
    {
      name: Modality.DANCA,
      color: 'bg-purple-600',
      description: 'Ritmos variados e expressão corporal.',
      schedule: [
        { days: 'Terça e Quinta', times: ['07h10', '11h10', '17h10', '18h'] },
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Informativo */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
              <Calendar size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Grade de Turmas</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Capacidade: 12 Alunos por Subturma (A/B)</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <Clock size={16} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Fluxo: 06:00 - 20:00</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <MapPin size={16} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Espaço Fitness SEDUC</span>
            </div>
          </div>
        </div>
        <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Grid de Modalidades */}
      <div className="space-y-12">
        {activities.map((activity) => (
          <section key={activity.name} className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className={`w-3 h-10 rounded-full ${activity.color}`} />
              <div>
                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">{activity.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{activity.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activity.schedule.map((slot, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                  <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{slot.days}</span>
                    <span className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-[9px] font-black text-slate-400 uppercase">
                      {slot.times.length} Horários
                    </span>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {slot.times.map(time => (
                      <div key={time} className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <p className="text-sm font-black text-slate-800 leading-none">{time}</p>
                          <div className="h-[1px] flex-1 bg-slate-100"></div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {['Turma A', 'Turma B'].map(turma => {
                            const count = getOccupancy(activity.name as Modality, slot.days, time, turma);
                            const isFull = count >= 12;
                            const percentage = (count / 12) * 100;
                            
                            return (
                              <div key={turma} className={`p-3 rounded-xl border transition-all ${isFull ? 'bg-orange-50/50 border-orange-100' : 'bg-slate-50/50 border-slate-100'}`}>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-[9px] font-black uppercase text-slate-500">{turma}</span>
                                  <span className={`text-[10px] font-bold ${isFull ? 'text-orange-600' : 'text-emerald-600'}`}>
                                    {count}/12
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-700 ${isFull ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  />
                                </div>
                                {isFull && (
                                  <p className="text-[8px] font-black text-orange-600 uppercase mt-1.5 text-right tracking-tighter">ESPERA ATIVA</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Informativo de Reservas Especiais */}
      <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 flex flex-col md:flex-row items-start gap-6 shadow-xl shadow-emerald-900/5">
        <div className="p-4 bg-white rounded-2xl text-emerald-600 shadow-sm border border-emerald-100">
          <Info size={28} />
        </div>
        <div className="flex-1">
          <h5 className="font-black text-emerald-900 uppercase text-sm tracking-tight mb-2">Protocolo de Subturmas</h5>
          <p className="text-xs text-emerald-800/70 leading-relaxed font-medium">
            Cada horário (ex: 07h) é composto por duas turmas independentes: <strong>Turma A</strong> e <strong>Turma B</strong>. 
            Cada uma possui limite estrito de <strong>12 servidores</strong>. Ao realizar a matrícula, o sistema valida a ocupação da turma específica escolhida. Alunos matriculados antes da implementação desta subdivisão foram alocados automaticamente na Turma A.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
