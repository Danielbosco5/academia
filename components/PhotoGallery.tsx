
import React, { useState, useEffect, useMemo } from 'react';
import { Camera, Search, Calendar, Loader2, ImageOff, RefreshCw, Filter, User } from 'lucide-react';
import { Student, AttendanceRecord } from '../types';
import { attendanceService } from '../services/attendanceService';
import PhotoModal from './PhotoModal';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 12;

interface PhotoGalleryProps {
  students: Student[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ students }) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cpfFilter, setCpfFilter] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    studentName: string;
    hour: string;
    date: string;
  } | null>(null);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await attendanceService.getByDateRange(startDate, endDate);
      setRecords(data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Erro ao carregar registros:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const recordsWithPhotos = useMemo(() => {
    let filtered = records.filter(r => r.photo && !r.photo.startsWith('data:'));
    if (cpfFilter.trim()) {
      const cleanCpf = cpfFilter.replace(/\D/g, '');
      filtered = filtered.filter(r => r.studentCpf.includes(cleanCpf));
    }
    return filtered;
  }, [records, cpfFilter]);

  const totalPages = Math.ceil(recordsWithPhotos.length / ITEMS_PER_PAGE);
  const paginatedRecords = recordsWithPhotos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStudentName = (cpf: string) => {
    return students.find(s => s.cpf === cpf)?.name || 'Servidor';
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadRecords();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-widest text-xs">Galeria de Fotos</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Registros fotográficos de frequência</p>
            </div>
          </div>
          <div className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
            {recordsWithPhotos.length} fotos
          </div>
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch} className="p-6 space-y-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                <Filter size={10} className="inline mr-1" />
                Filtrar por CPF / Nome
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="text"
                  placeholder="Digite CPF ou nome..."
                  value={cpfFilter}
                  onChange={e => {
                    setCpfFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:border-emerald-400 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                <Calendar size={10} className="inline mr-1" />
                Data Início
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:border-emerald-400 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                <Calendar size={10} className="inline mr-1" />
                Data Fim
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:border-emerald-400 outline-none transition-all"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-100 flex items-center gap-2"
              >
                <RefreshCw size={14} />
                Buscar
              </button>
            </div>
          </div>
        </form>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-emerald-500">
              <Loader2 size={48} className="animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Carregando fotos...</p>
            </div>
          ) : recordsWithPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <ImageOff size={64} className="mb-4 opacity-30" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Nenhuma foto encontrada</p>
              <p className="text-[10px] text-slate-400 font-medium">Altere os filtros de data ou CPF e tente novamente</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {paginatedRecords.map(record => {
                  const studentName = getStudentName(record.studentCpf);
                  const date = formatDate(record.timestamp);
                  return (
                    <div
                      key={record.id}
                      onClick={() => setSelectedPhoto({
                        url: record.photo!,
                        studentName,
                        hour: record.hour,
                        date
                      })}
                      className="group cursor-pointer bg-white rounded-2xl border-2 border-slate-100 hover:border-emerald-300 overflow-hidden shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="aspect-square bg-slate-100 relative overflow-hidden">
                        <img
                          src={record.photo}
                          alt={studentName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-white text-[9px] font-black uppercase tracking-widest">Clique para ampliar</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <User size={12} className="text-emerald-500 shrink-0" />
                          <p className="font-black text-slate-800 text-[11px] truncate uppercase tracking-tight">
                            {studentName.split(' ')[0]}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-400 font-bold">{date}</span>
                          <span className="text-[9px] text-emerald-600 font-black">{record.hour}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={recordsWithPhotos.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                    label="fotos"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          photoUrl={selectedPhoto.url}
          studentName={selectedPhoto.studentName}
          hour={selectedPhoto.hour}
          date={selectedPhoto.date}
        />
      )}
    </div>
  );
};

export default PhotoGallery;
