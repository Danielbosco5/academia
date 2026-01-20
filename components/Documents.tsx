
import React, { useRef } from 'react';
import { FileText, Upload, Download, Trash2, Search } from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentsProps {
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
}

const Documents: React.FC<DocumentsProps> = ({ documents, setDocuments }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc: DocumentItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: file.name.split('.')[0],
        fileName: file.name,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setDocuments(prev => [...prev, newDoc]);
    }
  };

  const deleteDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center text-blue-500">
          <Upload size={40} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-gray-800">Upload de Documentos Gerais</h3>
          <p className="text-gray-500 mb-4">Adicione regulamentos, termos de uso ou avisos gerais da academia.</p>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Selecionar Arquivo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h4 className="font-bold text-gray-800">Documentos Disponíveis</h4>
        </div>
        
        <div className="divide-y divide-gray-100">
          {documents.map(doc => (
            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-red-50 text-red-500 p-2 rounded-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{doc.title}</p>
                  <p className="text-xs text-gray-400">Enviado em: {doc.uploadDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                  <Download size={20} />
                </button>
                <button 
                  onClick={() => deleteDoc(doc.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              Nenhum documento cadastrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;
