
import { supabase } from '../lib/supabase';
import { AttendanceRecord } from '../types';

// Garante que o bucket de fotos de frequência existe
async function ensureAttendanceBucket() {
  const bucketName = 'attendance-photos';
  const { data } = await supabase.storage.getBucket(bucketName);
  if (!data) {
    await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 2 * 1024 * 1024, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    });
  }
}

// Faz upload de foto base64 para o Supabase Storage e retorna a URL pública
async function uploadPhoto(base64Data: string, studentCpf: string): Promise<string | undefined> {
  try {
    await ensureAttendanceBucket();

    // Converte base64 data URL para Blob
    const base64Response = await fetch(base64Data);
    const blob = await base64Response.blob();

    const timestamp = Date.now();
    const fileName = `${studentCpf}_${timestamp}.jpg`;
    const filePath = `${new Date().toISOString().split('T')[0]}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('attendance-photos')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      console.error('Erro ao fazer upload da foto:', uploadError);
      return undefined;
    }

    const { data: urlData } = supabase.storage
      .from('attendance-photos')
      .getPublicUrl(filePath);

    return urlData?.publicUrl || undefined;
  } catch (err) {
    console.error('Erro no upload da foto de frequência:', err);
    return undefined;
  }
}

export const attendanceService = {
  async getToday() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .gte('timestamp', `${today}T00:00:00`)
        .order('timestamp', { ascending: false });
      
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return (data || []).map(row => ({
        id: row.id,
        studentCpf: row.student_cpf,
        timestamp: row.timestamp,
        hour: row.hour,
        photo: row.photo_url
      }));
    } catch (err) {
      console.error("attendanceService.getToday failed:", err);
      return [];
    }
  },

  async getByDateRange(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .gte('timestamp', `${startDate}T00:00:00`)
        .lte('timestamp', `${endDate}T23:59:59`)
        .order('timestamp', { ascending: false });
      
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return (data || []).map(row => ({
        id: row.id,
        studentCpf: row.student_cpf,
        timestamp: row.timestamp,
        hour: row.hour,
        photo: row.photo_url
      }));
    } catch (err) {
      console.error("attendanceService.getByDateRange failed:", err);
      return [];
    }
  },

  async record(studentCpf: string, hour: string, photo?: string) {
    // Faz upload da foto para o Storage antes de gravar o registro
    let photoUrl: string | undefined;
    if (photo && photo.startsWith('data:')) {
      photoUrl = await uploadPhoto(photo, studentCpf);
    } else {
      photoUrl = photo; // Já é uma URL ou undefined
    }

    const { data, error } = await supabase
      .from('attendance_records')
      .insert([{
        student_cpf: studentCpf,
        hour: hour,
        photo_url: photoUrl
      }])
      .select();
    
    if (error) throw error;
    return { ...data[0], photo_url: photoUrl };
  }
};
