
import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, Users, FileText, Ban, Clock } from 'lucide-react';
import { Student, AttendanceRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ReportsProps {
  students: Student[];
  attendance: AttendanceRecord[];
}

const Reports: React.FC<ReportsProps> = ({ students, attendance }) => {
  const [reportType, setReportType] = useState('cadastro');

  const studentsByModality = [
    { name: 'Academia', total: students.filter(s => s.modality === 'Academia').length },
    { name: 'Funcional', total: students.filter(s => s.modality === 'Funcional').length },
    { name: 'Dança', total: students.filter(s => s.modality === 'Dança').length },
  ];

  const reportOptions = [
    { id: 'cadastro', label: 'Dados de Cadastro', icon: Users },
    { id: 'frequencia', label: 'Frequência por Período', icon: BarChart3 },
    { id: 'alunos', label: 'Lista Completa de Alunos', icon: FileText },
    { id: 'bloqueados', label: 'Alunos Bloqueados', icon: Ban },
  ];

  return (
    <div className="space-y-8">
      {/* Report Type Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportOptions.map(opt => (
          <button
            key={opt.id}
            onClick={() => setReportType(opt.id)}
            className={`p-6 rounded-2xl border transition-all flex flex-col items-center text-center gap-3 ${
              reportType === opt.id 
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
              : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200'
            }`}
          >
            <opt.icon size={32} />
            <span className="font-bold text-sm">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Adesão por Modalidade</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsByModality}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {studentsByModality.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#a855f7'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-gray-800 mb-4">Exportar Relatório</h3>
          <p className="text-sm text-gray-500 mb-6">Selecione o formato desejado para baixar o relatório de <span className="font-bold text-blue-600 uppercase">"{reportType}"</span>.</p>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors font-semibold text-gray-700">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="text-green-600" />
                Planilha Excel (.xlsx)
              </div>
              <Download size={18} />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors font-semibold text-gray-700">
              <div className="flex items-center gap-3">
                <FileText className="text-red-600" />
                Documento PDF (.pdf)
              </div>
              <Download size={18} />
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Registros totais</span>
              <span className="font-bold text-gray-800">{students.length}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Período</span>
              <span className="font-bold text-gray-800">Janeiro/2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h4 className="font-bold text-gray-800">Prévia do Relatório</h4>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">Gestão de Turmas</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase font-bold">
                <th className="p-4">Aluno</th>
                <th className="p-4">CPF</th>
                <th className="p-4">Cronograma</th>
                <th className="p-4">Horário</th>
                <th className="p-4">Modalidade</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.slice(0, 10).map(s => (
                <tr key={s.id} className="text-sm hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{s.name}</td>
                  <td className="p-4 text-gray-600 font-mono text-xs">{s.cpf}</td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                      {s.trainingDays || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4">
                    {s.trainingTime ? (
                      <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                        <Clock size={14} />
                        {s.trainingTime}
                      </div>
                    ) : (
                      <span className="text-gray-300 italic">---</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-600">{s.modality}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${s.blocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {s.blocked ? 'Bloqueado' : 'Ativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
