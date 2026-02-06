
import { supabase } from '../lib/supabase';
import { Student } from '../types';

const mapFromDb = (row: any): Student => {
  const trainingValue = row.training_time || '';
  const [time, turma] = trainingValue.includes(' | ') 
    ? trainingValue.split(' | ') 
    : [trainingValue, 'Turma A'];

  return {
    id: row.id,
    cpf: row.cpf || '',
    name: row.name || 'Sem Nome',
    department: row.department || '',
    phone: row.phone || '',
    birthDate: row.birth_date || '',
    age: row.age || 0,
    gender: row.gender || 'Masculino',
    blocked: !!row.blocked,
    onWaitlist: !!row.on_waitlist,
    modality: row.modality,
    trainingDays: row.training_days,
    trainingTime: time.trim(),
    turma: turma.trim(),
    createdAt: row.created_at
  };
};

const mapToDb = (student: Partial<Student>) => {
  const combinedTime = student.trainingTime && student.turma 
    ? `${student.trainingTime} | ${student.turma}` 
    : student.trainingTime;

  return {
    cpf: student.cpf,
    name: student.name,
    department: student.department,
    phone: student.phone,
    birth_date: student.birthDate,
    age: student.age,
    gender: student.gender,
    blocked: student.blocked,
    on_waitlist: student.onWaitlist,
    modality: student.modality,
    training_days: student.trainingDays,
    training_time: combinedTime
  };
};

export const studentService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        if (error.code === '42P01') return []; // Tabela não existe ainda
        throw error;
      }
      return (data || []).map(mapFromDb);
    } catch (err) {
      console.error("studentService.getAll failed:", err);
      return [];
    }
  },

  async create(student: Student) {
    const { data, error } = await supabase
      .from('students')
      .insert([mapToDb(student)])
      .select();
    
    if (error) throw error;
    return mapFromDb(data[0]);
  },

  async update(id: string, student: Partial<Student>) {
    const { data, error } = await supabase
      .from('students')
      .update(mapToDb(student))
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return mapFromDb(data[0]);
  },

  async toggleBlock(cpf: string, isBlocked: boolean) {
    const { error } = await supabase
      .from('students')
      .update({ blocked: isBlocked })
      .eq('cpf', cpf);
    
    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
