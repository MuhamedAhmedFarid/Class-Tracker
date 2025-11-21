import { supabase } from '@/lib/supabase';

// Default avatar list
const DEFAULT_AVATAR_POOL = [
  'https://randomuser.me/api/portraits/lego/1.jpg',
  'https://randomuser.me/api/portraits/lego/2.jpg',
  'https://randomuser.me/api/portraits/lego/3.jpg',
  'https://randomuser.me/api/portraits/lego/4.jpg',
  'https://randomuser.me/api/portraits/lego/5.jpg',
  'https://randomuser.me/api/portraits/lego/6.jpg',
  'https://randomuser.me/api/portraits/lego/7.jpg',
  'https://randomuser.me/api/portraits/lego/8.jpg',
  'https://randomuser.me/api/portraits/lego/9.jpg',
  'https://randomuser.me/api/portraits/lego/10.jpg',
  'https://randomuser.me/api/portraits/lego/11.jpg',
  'https://randomuser.me/api/portraits/lego/13.jpg',
  'https://randomuser.me/api/portraits/lego/14.jpg',
  'https://randomuser.me/api/portraits/lego/15.jpg',
  'https://randomuser.me/api/portraits/lego/16.jpg',
];

const getTodayDayAbbreviation = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date().getDay()];
}

/**
 * --- READ OPERATIONS ---
 */

export const fetchStudentsFromSupabase = async ({ queryKey }) => {
  // 1. Select the start_time and end_time columns
  let query = supabase
    .from('students')
    .select('id, name, image_url, last_session_time, hourly_rate, days_of_week, start_time, end_time')
    .order('name', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching students:', error);
    throw new Error('Failed to load students.');
  }
  
  return data.map((student, index) => ({
    id: student.id,
    name: student.name,
    image: student.image_url || DEFAULT_AVATAR_POOL[index % DEFAULT_AVATAR_POOL.length],
    // 2. Use the real data from the DB
    startTime: student.start_time || "N/A", 
    endTime: student.end_time || "N/A",
    hourlyRate: student.hourly_rate,
    daysOfWeek: student.days_of_week,
    // Keep this for compatibility if needed, or remove if unused
    time: `${student.start_time || 'N/A'} - ${student.end_time || 'N/A'}`, 
  }));
};

export const fetchTodayStudentsScheduled = async () => {
    const todayAbbr = getTodayDayAbbreviation();
    
    // 3. Fetch real times for the Home Screen
    const { data, error } = await supabase
        .from('students')
        .select(`id, name, days_of_week, start_time, end_time`)
        .contains('days_of_week', [todayAbbr])
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching today's schedule:", error);
        throw new Error(`Failed to load scheduled students.`);
    }

    return data.map(student => ({
        name: student.name,
        // 4. Map DB columns to the props expected by the Student component
        startDate: student.start_time || 'N/A', 
        endDate: student.end_time || 'N/A',
        current: false, 
    }));
};

/**
 * --- WRITE OPERATIONS ---
 */

export const createNewStudent = async ({ studentName, selectedDays, amount, fromTime, toTime }) => {
  const newStudentData = {
    name: studentName,
    hourly_rate: parseFloat(amount) || 0,
    days_of_week: selectedDays,
    // 5. This is where we SAVE the data to Supabase
    start_time: fromTime, 
    end_time: toTime,     
    last_session_time: new Date().toISOString(), 
  };
  
  const { data: student, error: studentError } = await supabase
    .from('students')
    .insert([newStudentData])
    .select('id')
    .single();

  if (studentError) {
    console.error('Error creating student:', studentError);
    throw new Error(studentError.message);
  }

  return student;
};

export const updateStudent = async ({ id, newName }) => {
  const { error } = await supabase.from('students').update({ name: newName }).eq('id', id);
  if (error) throw new Error(error.message);
  return true;
};

export const deleteStudent = async (id) => {
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
};