
import React, { useState, useEffect } from 'react';
import { UserPlus, Save, Phone, Building, Hash, Calendar, User, Clock, AlertTriangle, CalendarDays } from 'lucide-react';
import { Student, Modality } from '../types';

interface StudentFormProps {
  onSave: (student: Student) => void;
  students: Student[];
  initialData?: Student;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSave, students, initialData }) => {
  const [formData, setFormData] = useState<Partial<Student>>(initialData || {
    cpf: '', name: '', department: '', phone: '', birthDate: '', age: 0, gender: 'Masculino',
    modality: Modality.ACADEMIA, trainingDays: 'Segunda, Quarta e Sexta', trainingTime: '', blocked: false
  });

  useEffect(() => {
    if (formData.birthDate) {
      const birth = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ ...prev, age: age >= 0 ? age : 0 }));
    }
  }, [formData.birthDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.trainingTime) return alert('Por favor, selecione um horário.');
    
    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      cpf: formData.cpf?.replace(/\D/g, '') || '',
      name: formData.name || '',
      department: formData.department || '',
      phone: formData.phone || '',
      birthDate: formData.birthDate || '',
      age: formData.age || 0,
      gender: formData.gender || 'Masculino',
      blocked: false,
      modality: formData.modality as Modality,
      trainingDays: formData.trainingDays,
      trainingTime: formData.trainingTime,
      createdAt: new Date().toISOString()
    });
  };

  const getOccupancy = (time: string) => 
    students.filter(s => 
      !s.onWaitlist && 
      s.modality === formData.modality && 
      s.trainingDays === formData.trainingDays && 
      s.trainingTime === time
    ).length;

  const dayOptions = ['Segunda, Quarta e Sexta', 'Terça e Quinta'];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="bg-emerald-600 p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <UserPlus size={24} /> Matrícula do Servidor
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2 lg:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
            <input 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Lotação (Unidade/Gerência)</label>
            <input 
              required 
              placeholder="Ex: SEDUC / G.TI"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              value={formData.department} 
              onChange={e => setFormData({...formData, department: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">CPF</label>
            <input 
              required 
              placeholder="000.000.000-00"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              value={formData.cpf} 
              onChange={e => setFormData({...formData, cpf: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp / Telefone</label>
            <input 
              required 
              placeholder="(62) 99999-9999"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Sexo</label>
            <select 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white transition-all"
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value})}
            >
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Data de Nascimento</label>
            <input 
              required
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              value={formData.birthDate} 
              onChange={e => setFormData({...formData, birthDate: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Idade (Automática)</label>
            <input 
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 font-bold outline-none" 
              value={formData.age + ' anos'} 
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 space-y-4 pt-4 border-t">
            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
              <Dumbbell size={18} className="text-emerald-600" /> Modalidade
            </label>
            <div className="flex flex-wrap gap-2">
              {[Modality.ACADEMIA, Modality.FUNCIONAL, Modality.DANCA].map(mod => (
                <button 
                  key={mod} 
                  type="button" 
                  onClick={() => setFormData({...formData, modality: mod})} 
                  className={`px-6 py-2 rounded-full border-2 font-bold transition-all shadow-sm ${formData.modality === mod ? 'bg-emerald-600 border-emerald-600 text-white scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-200'}`}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-3 space-y-4 pt-4 border-t">
            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
              <CalendarDays size={18} className="text-emerald-600" /> Dias de Treino
            </label>
            <div className="flex flex-wrap gap-2">
              {dayOptions.map(days => (
                <button 
                  key={days} 
                  type="button" 
                  onClick={() => setFormData({...formData, trainingDays: days})} 
                  className={`px-6 py-2 rounded-full border-2 font-bold transition-all shadow-sm ${formData.trainingDays === days ? 'bg-emerald-600 border-emerald-600 text-white scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-200'}`}
                >
                  {days}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-3 space-y-4 pt-4 border-t">
            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
              <Clock size={18} className="text-emerald-600" /> Selecione o Horário
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {(formData.modality === Modality.ACADEMIA ? ['06h','07h','11h','12h','13h','17h','18h','19h'] : ['07h10','11h10','17h10','18h']).map(time => {
                const occ = getOccupancy(time);
                const full = occ >= 10;
                return (
                  <button 
                    key={time} 
                    type="button" 
                    onClick={() => setFormData({...formData, trainingTime: time})} 
                    className={`p-3 rounded-lg border-2 text-center transition-all shadow-sm ${formData.trainingTime === time ? 'bg-emerald-600 border-emerald-600 text-white ring-2 ring-emerald-100 scale-105' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-white hover:border-emerald-200'}`}
                  >
                    <div className="text-sm font-bold">{time}</div>
                    <div className={`text-[10px] font-medium ${full ? 'text-white/80' : 'text-emerald-600'}`}>{occ}/10 vagas</div>
                    {full && <div className="text-[10px] text-orange-200 font-black uppercase mt-1 leading-none">Fila de Espera</div>}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 italic">As vagas são contabilizadas especificamente para a modalidade, dias e horário selecionados.</p>
          </div>
        </div>

        <div className="pt-6 border-t">
          <button type="submit" className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200 flex items-center justify-center gap-2 active:scale-[0.98]">
            <Save size={20} /> Finalizar Cadastro de Matrícula
          </button>
        </div>
      </form>
    </div>
  );
};

// Mock de ícone não importado
const Dumbbell = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6.5 6.5 4 4"/><path d="m15 9 3-3"/><path d="m3 11 2 2"/><path d="m11 19 2 2"/><path d="m21 13-2-2"/><path d="m13 5-2-2"/><path d="m9 15-3 3"/><path d="m17.5 17.5 2.5 2.5"/><path d="M11 14.5a3.5 3.5 0 1 0 5-5"/><path d="M4.5 11a3.5 3.5 0 1 0 5-5"/><path d="M14.5 19a3.5 3.5 0 1 0 5-5"/><path d="M12 12c.5-1.5 2-2 3.5-1.5s2 2 1.5 3.5-2 2-3.5 1.5-2-2-1.5-3.5" opacity=".2"/>
  </svg>
);

export default StudentForm;
