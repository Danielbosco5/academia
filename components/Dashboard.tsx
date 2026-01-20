
import React from 'react';
import { Users, ClipboardCheck, Ban, Clock, ChevronRight, Shield, Camera, BarChart3, ListOrdered } from 'lucide-react';
import { Student, AttendanceRecord, View, User, UserRole } from '../types';

interface DashboardProps {
  students: Student[];
  attendance: AttendanceRecord[];
  onNavigate: (view: View) => void;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ students, attendance, onNavigate, user }) => {
  const stats = [
    { label: 'Total Alunos', value: students.filter(s => !s.onWaitlist).length, icon: Users, color: 'bg-emerald-600', view: 'students-list' as View, roles: [UserRole.ADMIN] },
    { label: 'Presenças Hoje', value: attendance.filter(a => a.timestamp.startsWith(new Date().toISOString().split('T')[0])).length, icon: ClipboardCheck, color: 'bg-green-600', view: 'attendance' as View, roles: [UserRole.ADMIN, UserRole.TEACHER] },
    { label: 'Fila Espera', value: students.filter(s => s.onWaitlist).length, icon: ListOrdered, color: 'bg-orange-600', view: 'waitlist' as View, roles: [UserRole.ADMIN] },
    { label: 'Bloqueados', value: students.filter(s => s.blocked).length, icon: Ban, color: 'bg-red-600', view: 'block-student' as View, roles: [UserRole.ADMIN] },
  ];

  const filteredStats = stats.filter(stat => stat.roles.includes(user.role));

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero / Welcome */}
      <div className={`bg-gradient-to-br rounded-[2rem] p-6 md:p-10 text-white shadow-xl relative overflow-hidden ${user.role === UserRole.ADMIN ? 'from-emerald-700 via-emerald-800 to-emerald-950' : 'from-green-600 to-emerald-800'}`}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
            <Shield size={12} className="text-emerald-300" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-100">{user.role}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black mb-3">Olá, {user.name.split(' ')[0]}!</h1>
          <p className="text-emerald-100/80 max-w-lg text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
            {user.role === UserRole.ADMIN 
              ? 'Portal de gestão estratégica. Monitore os indicadores e garanta a eficiência operacional.'
              : 'Acompanhe as atividades e registre as presenças dos servidores hoje.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => onNavigate('attendance')}
              className="w-full sm:w-auto px-6 md:px-8 py-3 bg-white text-emerald-900 font-black rounded-xl hover:bg-emerald-50 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <Camera size={18} />
              Terminal de Acesso
            </button>
            {user.role === UserRole.ADMIN && (
              <button 
                onClick={() => onNavigate('reports')}
                className="w-full sm:w-auto px-6 md:px-8 py-3 bg-emerald-500/20 text-white border border-emerald-400/30 font-bold rounded-xl hover:bg-emerald-500/30 transition-all backdrop-blur-sm text-sm"
              >
                Gerar Relatórios
              </button>
            )}
          </div>
        </div>
        
        <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute right-6 bottom-6 opacity-10 hidden md:block">
          <Users size={120} className="text-white" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${filteredStats.length} gap-4 md:gap-6`}>
        {filteredStats.map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => onNavigate(stat.view)}
            className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center md:block"
          >
            <div className="flex items-center justify-between md:mb-6 mr-4 md:mr-0">
              <div className={`${stat.color} p-3 md:p-4 rounded-xl md:rounded-2xl text-white shadow-lg shadow-gray-200 group-hover:scale-105 transition-transform shrink-0`}>
                <stat.icon size={24} />
              </div>
              <ChevronRight className="hidden md:block text-gray-200 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-black text-gray-800 leading-none">{stat.value}</div>
              <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Attendance */}
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-emerald-50/20 shrink-0">
            <h3 className="font-black text-emerald-900 flex items-center gap-2 text-sm">
              <ClipboardCheck size={18} className="text-emerald-600" />
              Presenças Recentes
            </h3>
            <button onClick={() => onNavigate('attendance')} className="text-emerald-700 text-[10px] font-black uppercase hover:underline">Ver Todos</button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {attendance.length > 0 ? (
              attendance.slice(0, 10).map((record) => {
                const student = students.find(s => s.cpf === record.studentCpf);
                return (
                  <div key={record.id} className="p-4 flex items-center space-x-3 hover:bg-emerald-50/50 transition-colors border-b border-gray-50 last:border-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-black shrink-0 overflow-hidden">
                      {record.photo ? <img src={record.photo} className="w-full h-full object-cover" /> : student?.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{student?.name || 'Servidor'}</p>
                      <p className="text-[10px] text-gray-400 truncate">Matrícula: {record.studentCpf}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-emerald-700 font-black text-xs">{record.hour}</div>
                      <div className="text-[9px] text-gray-400 font-medium">Hoje</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-10 text-gray-300">
                <ClipboardCheck size={48} className="opacity-20 mb-3" />
                <p className="text-xs font-bold uppercase">Nenhum registro hoje</p>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-6 md:p-8">
          <h3 className="font-black text-emerald-900 mb-6 flex items-center gap-2 text-sm">
            <BarChart3 className="text-emerald-600" size={18} />
            Engajamento por Turma
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Academia', students: students.filter(s => s.modality === 'Academia' && !s.onWaitlist).length, color: 'bg-emerald-500' },
              { name: 'Funcional', students: students.filter(s => s.modality === 'Funcional' && !s.onWaitlist).length, color: 'bg-green-500' },
              { name: 'Dança', students: students.filter(s => s.modality === 'Dança' && !s.onWaitlist).length, color: 'bg-teal-500' }
            ].map((mod) => (
              <div key={mod.name} className="flex items-center justify-between p-4 rounded-2xl border border-emerald-50 hover:bg-emerald-50/30 transition-all">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${mod.color}`} />
                  <div>
                    <span className="font-bold text-gray-800 text-sm block leading-none">{mod.name}</span>
                    <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">{mod.students} Ativos</span>
                  </div>
                </div>
                <div className="bg-emerald-950 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  Ver
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
