
import React, { useState, useMemo, useEffect } from 'react';
import { BarChart3, Download, FileSpreadsheet, Users, FileText, Ban, Clock, CalendarDays, Loader2 } from 'lucide-react';
import { Student, AttendanceRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { attendanceService } from '../services/attendanceService';
import Pagination from './Pagination';

const PREVIEW_PER_PAGE = 10;
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

interface ReportsProps {
  students: Student[];
  attendance: AttendanceRecord[];
}

const Reports: React.FC<ReportsProps> = ({ students, attendance }) => {
  const [reportType, setReportType] = useState('cadastro');
  const [previewPage, setPreviewPage] = useState(1);

  // Filtro de mês/ano para frequência
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);

  // Buscar dados de frequência quando mês/ano mudar e tipo for frequência
  useEffect(() => {
    if (reportType !== 'frequencia') return;

    const fetchAttendance = async () => {
      setIsLoadingAttendance(true);
      try {
        const startDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        const endDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
        const data = await attendanceService.getByDateRange(startDate, endDate);
        setFilteredAttendance(data);
      } catch (err) {
        console.error('Erro ao buscar frequência:', err);
        setFilteredAttendance([]);
      } finally {
        setIsLoadingAttendance(false);
      }
    };

    fetchAttendance();
  }, [reportType, selectedMonth, selectedYear]);

  // Dados de frequência a usar: filtrados por mês ou do dia atual
  const attendanceData = reportType === 'frequencia' ? filteredAttendance : attendance;
  const currentPeriod = `${monthNames[selectedMonth]}/${selectedYear}`;

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

  const filteredData = useMemo(() => {
    setPreviewPage(1);
    switch (reportType) {
      case 'bloqueados': return students.filter(s => s.blocked);
      case 'alunos': return students;
      case 'frequencia': return students;
      case 'cadastro': 
      default: return students;
    }
  }, [reportType, students]);

  const reportTitle = useMemo(() => {
    switch (reportType) {
      case 'bloqueados': return 'Alunos Bloqueados';
      case 'alunos': return 'Lista Completa de Alunos';
      case 'frequencia': return 'Frequência por Período';
      case 'cadastro':
      default: return 'Dados de Cadastro';
    }
  }, [reportType]);

  const generateCSV = () => {
    const headers = ['Nome', 'CPF', 'Modalidade', 'Dias', 'Horário', 'Turma', 'Unidade', 'Status'];
    const rows = filteredData.map(s => [
      s.name,
      s.cpf,
      s.modality,
      s.trainingDays || '',
      s.trainingTime || '',
      s.turma || '',
      s.department,
      s.blocked ? 'Bloqueado' : (s.onWaitlist ? 'Fila Espera' : 'Ativo')
    ]);

    if (reportType === 'frequencia') {
      const freqHeaders = ['Nome', 'CPF', 'Data/Hora Entrada', 'Horário Entrada', 'Data/Hora Saída', 'Horário Saída'];
      const freqRows = attendanceData.map(a => {
        const st = students.find(s => s.cpf === a.studentCpf);
        return [
          st?.name || 'Desconhecido',
          a.studentCpf,
          new Date(a.timestamp).toLocaleString('pt-BR'),
          a.hour,
          a.exitTimestamp ? new Date(a.exitTimestamp).toLocaleString('pt-BR') : '-',
          a.exitHour || '-'
        ];
      });
      return [freqHeaders, ...freqRows].map(r => r.join(';')).join('\n');
    }

    return [headers, ...rows].map(r => r.join(';')).join('\n');
  };

  const handleExportCSV = () => {
    const csv = '\uFEFF' + generateCSV(); // BOM para acentos no Excel
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const isFrequencia = reportType === 'frequencia';

    // Estatísticas resumidas
    const totalAtivos = students.filter(s => !s.blocked && !s.onWaitlist).length;
    const totalBloqueados = students.filter(s => s.blocked).length;
    const totalFila = students.filter(s => s.onWaitlist).length;
    const totalAcademia = students.filter(s => s.modality === 'Academia' && !s.onWaitlist).length;
    const totalFuncional = students.filter(s => s.modality === 'Funcional' && !s.onWaitlist).length;
    const totalDanca = students.filter(s => s.modality === 'Dança' && !s.onWaitlist).length;

    // Cabeçalho e linhas da tabela conforme tipo de relatório
    let tableHeaders = '';
    let tableRows = '';

    if (isFrequencia) {
      tableHeaders = `
        <th>Nº</th>
        <th>Nome do Servidor</th>
        <th>CPF</th>
        <th>Entrada</th>
        <th>Saída</th>
      `;
      tableRows = attendanceData.map((a, i) => {
        const st = students.find(s => s.cpf === a.studentCpf);
        return `
          <tr>
            <td style="text-align:center;color:#6b7280;">${i + 1}</td>
            <td style="font-weight:600;">${st?.name || 'Desconhecido'}</td>
            <td style="font-family:monospace;font-size:11px;">${a.studentCpf}</td>
            <td style="text-align:center;font-weight:700;color:#059669;">${a.hour} <span style="font-weight:400;color:#6b7280;font-size:10px;">(${new Date(a.timestamp).toLocaleDateString('pt-BR')})</span></td>
            <td style="text-align:center;font-weight:700;color:#ea580c;">${a.exitHour || '—'} ${a.exitTimestamp ? `<span style="font-weight:400;color:#6b7280;font-size:10px;">(${new Date(a.exitTimestamp).toLocaleDateString('pt-BR')})</span>` : ''}</td>
          </tr>
        `;
      }).join('');
    } else {
      tableHeaders = `
        <th>Nº</th>
        <th>Nome do Servidor</th>
        <th>CPF</th>
        <th>Unidade/Gerência</th>
        <th>Modalidade</th>
        <th>Dias</th>
        <th>Horário</th>
        <th>Turma</th>
        <th>Status</th>
      `;
      tableRows = filteredData.map((s, i) => {
        const statusColor = s.blocked ? '#dc2626' : (s.onWaitlist ? '#d97706' : '#059669');
        const statusBg = s.blocked ? '#fef2f2' : (s.onWaitlist ? '#fffbeb' : '#ecfdf5');
        const statusText = s.blocked ? 'Bloqueado' : (s.onWaitlist ? 'Fila Espera' : 'Ativo');
        return `
          <tr>
            <td style="text-align:center;color:#6b7280;">${i + 1}</td>
            <td style="font-weight:600;">${s.name}</td>
            <td style="font-family:monospace;font-size:11px;">${s.cpf}</td>
            <td>${s.department || '—'}</td>
            <td><span style="background:#f0fdf4;color:#166534;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase;">${s.modality}</span></td>
            <td style="font-size:11px;">${s.trainingDays || '—'}</td>
            <td style="font-weight:700;color:#2563eb;">${s.trainingTime || '—'}</td>
            <td style="text-align:center;">${s.turma || '—'}</td>
            <td><span style="background:${statusBg};color:${statusColor};padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase;">${statusText}</span></td>
          </tr>
        `;
      }).join('');
    }

    const dataEmissao = new Date().toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Relatório - ${reportTitle}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        @page {
          size: A4 landscape;
          margin: 12mm 10mm;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1e293b;
          font-size: 12px;
          line-height: 1.4;
          background: #fff;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 16px;
          border-bottom: 3px solid #059669;
          margin-bottom: 20px;
        }

        .header-left h1 {
          font-size: 22px;
          font-weight: 900;
          color: #064e3b;
          letter-spacing: -0.5px;
        }

        .header-left h1 span {
          color: #059669;
        }

        .header-left p {
          font-size: 11px;
          color: #6b7280;
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .header-right {
          text-align: right;
          font-size: 10px;
          color: #6b7280;
        }

        .header-right .report-type {
          font-size: 14px;
          font-weight: 800;
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .header-right .badge {
          display: inline-block;
          background: #ecfdf5;
          color: #059669;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 4px;
        }

        .stats-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .stat-card {
          flex: 1;
          min-width: 120px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 16px;
          text-align: center;
        }

        .stat-card .value {
          font-size: 24px;
          font-weight: 900;
          color: #1e293b;
          line-height: 1;
        }

        .stat-card .label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
          color: #94a3b8;
          margin-top: 4px;
        }

        .stat-card.green { border-left: 4px solid #059669; }
        .stat-card.red { border-left: 4px solid #dc2626; }
        .stat-card.orange { border-left: 4px solid #d97706; }
        .stat-card.blue { border-left: 4px solid #2563eb; }
        .stat-card.purple { border-left: 4px solid #7c3aed; }
        .stat-card.teal { border-left: 4px solid #0d9488; }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          margin-top: 4px;
        }

        thead th {
          background: #0f172a;
          color: #94a3b8;
          padding: 10px 12px;
          text-align: left;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 800;
          white-space: nowrap;
        }

        thead th:first-child {
          border-radius: 8px 0 0 0;
        }

        thead th:last-child {
          border-radius: 0 8px 0 0;
        }

        tbody td {
          padding: 8px 12px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        tbody tr:hover {
          background: #f8fafc;
        }

        tbody tr:nth-child(even) {
          background: #fafbfc;
        }

        .table-container {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .table-header h3 {
          font-size: 13px;
          font-weight: 800;
          color: #1e293b;
        }

        .table-header .count {
          font-size: 10px;
          font-weight: 700;
          color: #059669;
          background: #ecfdf5;
          padding: 3px 10px;
          border-radius: 6px;
        }

        .footer {
          margin-top: 24px;
          padding-top: 12px;
          border-top: 2px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .footer strong {
          color: #64748b;
        }

        @media print {
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-left">
          <h1>Academia <span>GO</span></h1>
          <p>Sistema de Gestão — Espaço Fitness SEDUC</p>
        </div>
        <div class="header-right">
          <div class="report-type">${reportTitle}</div>
          <div>Emitido em: ${dataEmissao}</div>
          <div class="badge">Documento Oficial</div>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-card green">
          <div class="value">${totalAtivos}</div>
          <div class="label">Ativos</div>
        </div>
        <div class="stat-card red">
          <div class="value">${totalBloqueados}</div>
          <div class="label">Bloqueados</div>
        </div>
        <div class="stat-card orange">
          <div class="value">${totalFila}</div>
          <div class="label">Fila de Espera</div>
        </div>
        <div class="stat-card blue">
          <div class="value">${totalAcademia}</div>
          <div class="label">Academia</div>
        </div>
        <div class="stat-card purple">
          <div class="value">${totalFuncional}</div>
          <div class="label">Funcional</div>
        </div>
        <div class="stat-card teal">
          <div class="value">${totalDanca}</div>
          <div class="label">Dança</div>
        </div>
      </div>

      <div class="table-container">
        <div class="table-header">
          <h3>${reportTitle}</h3>
          <span class="count">${isFrequencia ? attendanceData.length : filteredData.length} registro(s)</span>
        </div>
        <table>
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableRows || '<tr><td colspan="9" style="text-align:center;padding:40px;color:#94a3b8;">Nenhum registro encontrado.</td></tr>'}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <div>Academia GO — Relatório gerado automaticamente pelo sistema</div>
        <div>Período: <strong>${currentPeriod}</strong> | Total de registros: <strong>${isFrequencia ? attendanceData.length : filteredData.length}</strong></div>
      </div>
    </body>
    </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1100,height=700');
    if (!printWindow) {
      alert('Popup bloqueado! Permita popups para exportar o PDF.');
      return;
    }
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 300);
    };
  };

  const previewTotalPages = Math.ceil(filteredData.length / PREVIEW_PER_PAGE);
  const previewData = useMemo(() => {
    const start = (previewPage - 1) * PREVIEW_PER_PAGE;
    return filteredData.slice(start, start + PREVIEW_PER_PAGE);
  }, [filteredData, previewPage]);

  // Anos disponíveis para seleção (do ano atual até 2 anos atrás)
  const availableYears = Array.from({ length: 3 }, (_, i) => currentDate.getFullYear() - i);

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

      {/* Filtro de Mês/Ano para Frequência */}
      {reportType === 'frequencia' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarDays size={20} className="text-blue-600" />
              <span className="font-black text-xs uppercase tracking-widest">Período do Relatório:</span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedMonth}
                onChange={e => { setSelectedMonth(Number(e.target.value)); setPreviewPage(1); }}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:border-blue-500 outline-none transition-all"
              >
                {monthNames.map((name, idx) => (
                  <option key={idx} value={idx}>{name}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={e => { setSelectedYear(Number(e.target.value)); setPreviewPage(1); }}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:border-blue-500 outline-none transition-all"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              {isLoadingAttendance ? (
                <span className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase">
                  <Loader2 size={16} className="animate-spin" /> Buscando...
                </span>
              ) : (
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg">
                  {filteredAttendance.length} registro(s)
                </span>
              )}
            </div>
          </div>
        </div>
      )}

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
            <button onClick={handleExportCSV} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors font-semibold text-gray-700">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="text-green-600" />
                Planilha CSV (.csv)
              </div>
              <Download size={18} />
            </button>
            <button onClick={handleExportPDF} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors font-semibold text-gray-700">
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
              <span className="font-bold text-gray-800">{reportType === 'frequencia' ? attendanceData.length : filteredData.length}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Período</span>
              <span className="font-bold text-gray-800">{currentPeriod}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h4 className="font-bold text-gray-800">Prévia do Relatório</h4>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">{reportTitle}{reportType === 'frequencia' ? ` — ${currentPeriod}` : ''}</span>
        </div>
        <div className="overflow-x-auto">
          {reportType === 'frequencia' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase font-bold">
                  <th className="p-4">Servidor</th>
                  <th className="p-4">CPF</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Entrada</th>
                  <th className="p-4">Saída</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoadingAttendance ? (
                  <tr><td colSpan={5} className="p-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <Loader2 size={20} className="animate-spin" />
                      <span className="font-bold text-xs uppercase tracking-widest">Carregando frequência...</span>
                    </div>
                  </td></tr>
                ) : attendanceData.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-400 text-sm font-medium">Nenhum registro de frequência em {currentPeriod}.</td></tr>
                ) : (
                  attendanceData.slice((previewPage - 1) * PREVIEW_PER_PAGE, previewPage * PREVIEW_PER_PAGE).map(a => {
                    const st = students.find(s => s.cpf === a.studentCpf);
                    return (
                      <tr key={a.id} className="text-sm hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-800">{st?.name || 'Desconhecido'}</td>
                        <td className="p-4 text-gray-600 font-mono text-xs">{a.studentCpf}</td>
                        <td className="p-4 text-gray-600 text-xs">{new Date(a.timestamp).toLocaleDateString('pt-BR')}</td>
                        <td className="p-4">
                          <span className="text-emerald-600 font-bold">{a.hour}</span>
                        </td>
                        <td className="p-4">
                          {a.exitHour ? (
                            <span className="text-orange-600 font-bold">{a.exitHour}</span>
                          ) : (
                            <span className="text-gray-300 italic text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
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
              {previewData.map(s => (
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
          )}
        </div>

        <Pagination
          currentPage={previewPage}
          totalPages={reportType === 'frequencia' ? Math.ceil(attendanceData.length / PREVIEW_PER_PAGE) : previewTotalPages}
          totalItems={reportType === 'frequencia' ? attendanceData.length : filteredData.length}
          itemsPerPage={PREVIEW_PER_PAGE}
          onPageChange={setPreviewPage}
          label="registros"
        />
      </div>
    </div>
  );
};

export default Reports;
