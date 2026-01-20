
import React, { useState } from 'react';
import { Files, Search, Upload, User, FileText, Trash2 } from 'lucide-react';
import { Student, DocumentItem } from '../types';

interface StudentDocsProps {
  students: Student[];
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
}

const StudentDocuments: React.FC<StudentDocsProps> = ({ students, documents, setDocuments }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.cpf.includes(searchTerm)
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const studentDocs = documents.filter(d => d.studentId === selectedStudentId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedStudentId) return;
    const file = e.target.files?.[0];
    if (file) {
      const newDoc: DocumentItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: file.name.split('.')[0],
        fileName: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        studentId: selectedStudentId
      };
      setDocuments(prev => [...prev, newDoc]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List of Students */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar aluno..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredStudents.map(student => (
            <button
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className={`w-full p-4 text-left border-b border-gray-50 transition-colors flex items-center space-x-3 hover:bg-blue-50 ${selectedStudentId === student.id ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {student.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{student.name}</p>
                <p className="text-xs text-gray-500">CPF: {student.cpf}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Student Specific Content */}
      <div className="lg:col-span-2 space-y-6">
        {selectedStudent ? (
          <>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-600 text-white rounded-xl">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-500">Documentos e Anexos Individuais</p>
                </div>
              </div>
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <Upload size={18} />
                Anexar
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-700">Arquivos do Aluno</p>
              </div>
              <div className="divide-y divide-gray-100">
                {studentDocs.length > 0 ? (
                  studentDocs.map(doc => (
                    <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <FileText className="text-blue-500" size={24} />
                        <div>
                          <p className="font-medium text-gray-800">{doc.title}</p>
                          <p className="text-xs text-gray-400">{doc.uploadDate}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setDocuments(prev => prev.filter(d => d.id !== doc.id))}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-400 italic">
                    Nenhum documento anexado para este aluno.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="h-full bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center">
            <Files className="text-gray-200 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-400">Selecione um aluno</h3>
            <p className="text-gray-400">Para visualizar e gerenciar os documentos individuais do servidor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDocuments;
