import { supabase } from '../lib/supabase.js';

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

export const fetchStudentsFromSupabase = async () => {
  let query = supabase
    .from('students')
    .select('id, name, image_url, hourly_rate, days_of_week, start_time, end_time, paid_amount, total_collected, outstanding_balance')
    .order('name', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching students:', error);
    throw new Error('Failed to load students.');
  }
  
  return data.map((student) => ({
    id: student.id,
    name: student.name,
    image: student.image_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
    startTime: student.start_time || "09:00 AM", 
    endTime: student.end_time || "10:00 AM",
    hourlyRate: student.hourly_rate,
    daysOfWeek: student.days_of_week || [],
    paidAmount: student.paid_amount || 0,
    totalCollected: student.total_collected || 0,
    outstandingBalance: student.outstanding_balance || 0,
    time: `${student.start_time || ''} - ${student.end_time || ''}`, 
  }));
};

// Fetch a single student with all attendance columns
export const fetchStudentById = async (id) => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
  
    if (error) {
      console.error('Error fetching student details:', error);
      throw new Error('Failed to load student details.');
    }
    return data;
};

export const fetchTodayStudentsScheduled = async () => {
    const todayAbbr = getTodayDayAbbreviation();
    
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
        id: student.id,
        name: student.name,
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
    start_time: fromTime, 
    end_time: toTime,     
    paid_amount: 0,
    total_collected: 0,
    outstanding_balance: 0,
    image_url: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`,
    // Initialize attendance flags to false
    monday_attended: false,
    tuesday_attended: false,
    wednesday_attended: false,
    thursday_attended: false,
    friday_attended: false,
    saturday_attended: false,
    sunday_attended: false
  };
  
  const { data, error } = await supabase
    .from('students')
    .insert([newStudentData])
    .select()
    .single();

  if (error) {
    console.error('Error creating student:', error);
    throw new Error(error.message);
  }

  return data;
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

export const recordPayment = async (studentId, amount) => {
    const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('paid_amount, total_collected, outstanding_balance, name')
        .eq('id', studentId)
        .single();
    
    if (fetchError) throw new Error(fetchError.message);

    const newPaidAmount = (student.paid_amount || 0) + amount;
    const newOutstanding = (student.outstanding_balance || 0) - amount;
    const newTotalCollected = (student.total_collected || 0) + amount;

    const { error: updateError } = await supabase
        .from('students')
        .update({ 
            paid_amount: newPaidAmount,
            outstanding_balance: newOutstanding,
            total_collected: newTotalCollected
        })
        .eq('id', studentId);

    if (updateError) throw new Error(updateError.message);

    const { error: recordError } = await supabase
        .from('payment_records')
        .insert([{
            student_id: studentId,
            amount: amount,
            date: new Date().toISOString(),
            student_name: student.name
        }]);

    if (recordError) throw new Error(recordError.message);

    return true;
};

// Toggle attendance for a specific day
export const toggleStudentAttendance = async (studentId, dayField, currentValue) => {
    const { error } = await supabase
        .from('students')
        .update({ [dayField]: currentValue }) // Directly set true/false instead of toggle
        .eq('id', studentId);

    if (error) throw new Error(error.message);
    return true;
};