
import React from 'react';
import { X, User, Clock, Calendar } from 'lucide-react';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl: string;
  studentName?: string;
  hour?: string;
  date?: string;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ isOpen, onClose, photoUrl, studentName, hour, date }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <User size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-xs uppercase tracking-widest">{studentName || 'Servidor'}</h3>
              <div className="flex items-center gap-3 mt-0.5">
                {date && (
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={10} /> {date}
                  </span>
                )}
                {hour && (
                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> {hour}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Photo */}
        <div className="bg-slate-950 flex items-center justify-center">
          <img 
            src={photoUrl} 
            alt={`Foto de ${studentName || 'Servidor'}`}
            className="w-full max-h-[70vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
