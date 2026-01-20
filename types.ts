
export enum Modality {
  ACADEMIA = 'Academia',
  FUNCIONAL = 'Funcional',
  DANCA = 'Dança'
}

export enum UserRole {
  ADMIN = 'Administrador',
  TEACHER = 'Professor'
}

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  active: boolean;
}

export interface Student {
  id: string;
  cpf: string;
  name: string;
  department: string; // Lotação
  phone: string;
  birthDate: string;
  age: number;
  gender: string;
  blocked: boolean;
  onWaitlist?: boolean; // Se o aluno está na fila de espera
  modality: Modality;
  trainingDays?: string; // Dias da semana escolhidos
  trainingTime?: string; // Horário escolhido
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentCpf: string;
  timestamp: string;
  hour: string;
  photo?: string; // Base64 da foto capturada
}

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  uploadDate: string;
  studentId?: string; // If it's a student specific document
}

export type View = 'home' | 'attendance' | 'add-student' | 'block-student' | 'documents' | 'student-documents' | 'reports' | 'schedules' | 'teachers' | 'students-list' | 'waitlist';
