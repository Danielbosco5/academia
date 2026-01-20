
import React, { useState, useRef, useEffect } from 'react';
import { Search, UserCheck, AlertCircle, Clock, Camera, CameraOff, RefreshCw, ShieldAlert } from 'lucide-react';
import { Student, AttendanceRecord } from '../types';

interface AttendanceProps {
  students: Student[];
  attendance: AttendanceRecord[];
  onAddAttendance: (record: AttendanceRecord) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ students, attendance, onAddAttendance }) => {
  const [cpf, setCpf] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setupCamera = async () => {
    setCameraError(null);
    try {
      // Parar stream anterior se existir
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 }, 
          facingMode: 'user' 
        },
        audio: false 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
      setCameraError(null);
    } catch (err: any) {
      console.error("Erro ao acessar câmera:", err);
      setCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError("Acesso negado. Por favor, permita o uso da câmera nas configurações do seu navegador e recarregue.");
      } else {
        setCameraError("Não foi possível acessar a câmera. Verifique se ela está conectada.");
      }
    }
  };

  useEffect(() => {
    setupCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCpf = cpf.replace(/\D/g, '');
    const student = students.find(s => s.cpf === cleanCpf);

    if (!student) {
      setMessage({ text: 'Servidor não encontrado.', type: 'error' });
    } else if (student.blocked) {
      setMessage({ text: 'ACESSO BLOQUEADO PELO SISTEMA.', type: 'error' });
    } else {
      const now = new Date();
      onAddAttendance({
        id: Math.random().toString(36).substr(2, 9),
        studentCpf: student.cpf,
        timestamp: now.toISOString(),
        hour: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setMessage({ text: `Presença: ${student.name.split(' ')[0]} registrada!`, type: 'success' });
      setCpf('');
    }
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Terminal Section */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-xl border border-emerald-100 overflow-hidden">
          <div className="bg-emerald-700 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera size={20} />
              <h3 className="font-black uppercase tracking-tight text-sm md:text-base">Terminal de Frequência</h3>
            </div>
          </div>
          
          <div className="p-5 md:p-8 space-y-6">
            <div className="aspect-video bg-emerald-950 rounded-2xl overflow-hidden relative shadow-inner flex items-center justify-center">
              {!cameraActive && !cameraError && (
                <div className="flex flex-col items-center justify-center text-emerald-800">
                  <RefreshCw size={40} className="mb-2 animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Iniciando Câmera...</p>
                </div>
              )}
              
              {cameraError && (
                <div className="flex flex-col items-center justify-center p-6 text-center text-white bg-red-950/80 absolute inset-0 z-10">
                  <ShieldAlert size={48} className="text-red-500 mb-4" />
                  <p className="text-xs font-bold uppercase mb-4 max-w-xs">{cameraError}</p>
                  <button 
                    onClick={setupCamera}
                    className="flex items-center gap-2 px-6 py-2 bg-white text-red-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-colors"
                  >
                    <RefreshCw size={14} />
                    Tentar Novamente
                  </button>
                </div>
              )}

              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover ${!cameraActive ? 'hidden' : 'block'}`} 
              />
              
              {cameraActive && (
                <div className="absolute inset-0 border-2 border-emerald-500/30 border-dashed rounded-2xl animate-pulse pointer-events-none" />
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-2">CPF do Servidor</label>
                <input 
                  type="text"
                  placeholder="000.000.000-00"
                  className="w-full px-5 py-4 bg-emerald-50 border-2 border-emerald-100 rounded-xl text-xl font-black text-emerald-950 focus:border-emerald-500 outline-none"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest">
                Registrar Presença
              </button>
            </form>

            {message && (
              <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                message.type === 'success' ? 'bg-emerald-900 text-white' : 'bg-red-900 text-white'
              }`}>
                {message.type === 'success' ? <UserCheck size={20} /> : <AlertCircle size={20} />}
                <p className="font-bold text-xs uppercase">{message.text}</p>
              </div>
            )}
          </div>
        </div>

        {/* Log Section */}
        <div className="w-full xl:w-80 bg-white rounded-[2rem] border border-gray-100 shadow-lg overflow-hidden flex flex-col h-[450px] xl:h-auto">
          <div className="p-4 bg-emerald-950 text-white font-black uppercase text-[10px] tracking-widest shrink-0 flex justify-between items-center">
            <span>Log de Presenças</span>
            <span className="bg-emerald-600 px-2 py-0.5 rounded-full">{attendance.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {attendance.length > 0 ? (
              attendance.map(rec => (
                <div key={rec.id} className="p-4 border-b border-gray-50 flex items-center justify-between hover:bg-emerald-50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-xs truncate">{students.find(s => s.cpf === rec.studentCpf)?.name || 'Servidor'}</p>
                    <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-tighter">Entrada: {rec.hour}</p>
                  </div>
                  <Clock size={14} className="text-gray-200 shrink-0" />
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-10 opacity-20">
                <RefreshCw size={32} className="animate-spin-slow mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Aguardando...</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Attendance;
