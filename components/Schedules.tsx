
import React from 'react';
import { Calendar, Clock, MapPin, Info } from 'lucide-react';

const Schedules: React.FC = () => {
  const academiaTimes = ['06h', '07h', '11h', '12h', '13h', '16h (Servidores da Limpeza)', '17h', '18h', '19h'];
  const specificActivityTimes = ['07h10 - 07h40', '11h10 - 11h40', '17h10 - 17h40', '18h - 18h30'];

  const activities = [
    {
      name: 'Academia',
      color: 'bg-blue-600',
      description: 'Treinamento de força e musculação.',
      schedule: [
        { days: 'Segunda, Quarta e Sexta', times: academiaTimes },
        { days: 'Terça e Quinta', times: academiaTimes },
      ]
    },
    {
      name: 'Funcional',
      color: 'bg-emerald-600',
      description: 'Exercícios dinâmicos de alta intensidade.',
      schedule: [
        { days: 'Segunda, Quarta e Sexta', times: specificActivityTimes },
      ]
    },
    {
      name: 'Dança',
      color: 'bg-purple-600',
      description: 'Ritmos variados e expressão corporal.',
      schedule: [
        { days: 'Terça e Quinta', times: specificActivityTimes },
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Grade de Horários</h3>
            <p className="text-gray-500">Quadro oficial sincronizado com o sistema de matrículas.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
            <Clock size={14} /> Ref: 06:00h - 19:00h
          </span>
          <span className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
            <MapPin size={14} /> Espaço Fitness
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {activities.map((activity) => (
          <div key={activity.name} className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden group flex flex-col">
            <div className={`${activity.color} p-6 text-white`}>
              <h4 className="text-2xl font-bold flex items-center justify-between mb-1">
                {activity.name}
                <Clock className="opacity-40 group-hover:rotate-12 transition-transform" />
              </h4>
              <p className="text-white/70 text-xs font-medium">{activity.description}</p>
            </div>
            
            <div className="p-6 space-y-8 flex-1">
              {activity.schedule.map((item, idx) => (
                <div key={idx} className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">{item.days}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.times.map(time => {
                      const isSpecial = time.includes('Servidores');
                      return (
                        <span 
                          key={time} 
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-default border ${
                            isSpecial 
                            ? 'bg-amber-50 text-amber-700 border-amber-200 italic flex items-center gap-1 w-full justify-center mt-2' 
                            : `bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-300`
                          }`}
                        >
                          {isSpecial && <Info size={12} />}
                          {time}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button className="w-full text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
                Baixar Quadro PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Extra Info */}
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
        <Clock className="text-blue-500 flex-shrink-0" size={24} />
        <div>
          <h5 className="font-bold text-blue-800 mb-1">Observação de Funcionamento</h5>
          <p className="text-sm text-blue-700 leading-relaxed">
            As atividades de <strong>Academia</strong> funcionam de segunda a sexta. As modalidades de <strong>Funcional</strong> e <strong>Dança</strong> possuem dias fixos conforme indicado acima. O horário das 16h na Academia é reservado exclusivamente para os <strong>servidores da limpeza</strong> realizarem seus exercícios físicos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
