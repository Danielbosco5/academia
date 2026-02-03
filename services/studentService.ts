
import { supabase } from '../lib/supabase';
import { Student } from '../types';

const mapFromDb = (row: any): Student => {
  // Extrai a Turma da string do horário (Ex: "08h | Turma A")
  const trainingValue = row.training_time || '';
  const [time, turma] = trainingValue.includes(' | ') 
    ? trainingValue.split(' | ') 
    : [trainingValue, 'Turma A'];

  return {
    id: row.id,
    cpf: row.cpf,
    name: row.name,
    department: row.department,
    phone: row.phone,
    birthDate: row.birth_date,
    age: row.age,
    gender: row.gender,
    blocked: row.blocked,
    onWaitlist: row.on_waitlist,
    modality: row.modality,
    trainingDays: row.training_days,
    trainingTime: time.trim(),
    turma: turma.trim(),
    createdAt: row.created_at
  };
};

const mapToDb = (student: Partial<Student>) => {
  // Combina Horário + Turma em uma única string para a coluna training_time
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
    // Não incluímos o campo 'turma' aqui pois ele não existe no schema do banco
  };
};

export const studentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error("Erro Supabase (getAll):", error.message);
      throw error;
    }
    return (data || []).map(mapFromDb);
  },

  async create(student: Student) {
    const { data, error } = await supabase
      .from('students')
      .insert([mapToDb(student)])
      .select();
    
    if (error) {
      console.error("Erro Supabase (create):", error.message);
      throw error;
    }
    return mapFromDb(data[0]);
  },

  async update(id: string, student: Partial<Student>) {
    const { data, error } = await supabase
      .from('students')
      .update(mapToDb(student))
      .eq('id', id)
      .select();
    
    if (error) {
      console.error("Erro Supabase (update):", error.message);
      throw error;
    }
    return mapFromDb(data[0]);
  },

  async toggleBlock(cpf: string, isBlocked: boolean) {
    const { error } = await supabase
      .from('students')
      .update({ blocked: isBlocked })
      .eq('cpf', cpf);
    
    if (error) {
      console.error("Erro Supabase (toggleBlock):", error.message);
      throw error;
    }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Erro Supabase (delete):", error.message);
      throw error;
    }
  }
};
