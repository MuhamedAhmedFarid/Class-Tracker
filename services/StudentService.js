import { supabase } from '@/lib/supabase';

// Helper function to format the database TIME string into a display string (e.g., "09:30 AM")
const formatTimeForDisplay = (timeString) => {
  try {
    const [hoursStr, minutesStr, period] = timeString.split(/[: ]+/).filter(Boolean);
    let hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);
    
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    
    // Setting date part to avoid timezone issues when converting military time
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return timeString;
  }
};

// Helper function to format the database TIMESTAMP into a custom display string (e.g., "Today, 10:10 AM")
const formatSessionTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'N/A';

    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const today = new Date().toDateString();
    const tsDate = date.toDateString();

    if (today === tsDate) {
        return `Today, ${time}`;
    }
    
    return `${day}, ${time}`;
  } catch (e) {
    return timestamp;
  }
};

/**
 * --- READ OPERATIONS ---
 */

/**
 * Fetches all students data from Supabase, filtered by search query.
 */
export const fetchStudentsFromSupabase = async ({ queryKey }) => {
  const [key, searchQuery] = queryKey;
  
  let query = supabase
    .from('students')
    .select('id, name, image_url, last_session_time')
    .order('name', { ascending: true });

  // NEW: Apply search filter using ilike
  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching students:', error);
    throw new Error('Failed to load students.');
  }
  
  return data.map(student => ({
    id: student.id,
    name: student.name,
    image: student.image_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
    time: formatSessionTime(student.last_session_time),
  }));
};

export const fetchTodaySessionsFromSupabase = async () => {
  const today = new Date().toISOString().split('T')[0]; 
  
  const { data, error } = await supabase
    .from('class_sessions')
    .select(`
      id,
      start_time,
      end_time,
      is_current,
      students (name)
    `)
    .eq('session_date', today)
    .order('start_time', { ascending: true });

  if (error) {
    console.error("Error fetching today's sessions:", error);
    throw new Error('Failed to load today\'s sessions.');
  }
  
  return data.map(session => ({
    name: session.students.name, 
    startDate: formatTimeForDisplay(session.start_time),
    endDate: formatTimeForDisplay(session.end_time),
    current: session.is_current,
  }));
};

/**
 * --- WRITE OPERATIONS (unchanged) ---
 */

/**
 * Creates a new student entry in the database.
 */
export const createNewStudent = async ({ studentName, selectedDays, amount, fromTime, toTime }) => {
  const convertToMilitaryTime = (time12hr) => {
    const [time, modifier] = time12hr.split(' ');
    let [hours, minutes] = time.split(' : ');
    
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
  };
  
  const newStudentData = {
    name: studentName,
    hourly_rate: parseFloat(amount),
    days_of_week: selectedDays,
    last_session_time: new Date().toISOString(), 
  };
  
  const { data: student, error: studentError } = await supabase
    .from('students')
    .insert([newStudentData])
    .select('id')
    .single();

  if (studentError) {
    console.error('Error creating student:', studentError);
    throw new Error('Failed to create student: ' + studentError.message);
  }
  
  const newSessionData = {
    student_id: student.id,
    session_date: new Date().toISOString().split('T')[0],
    start_time: convertToMilitaryTime(fromTime),
    end_time: convertToMilitaryTime(toTime),
  };

  const { error: sessionError } = await supabase
    .from('class_sessions')
    .insert([newSessionData]);

  if (sessionError) {
    console.warn('Warning: Could not create initial session for new student.', sessionError);
  }

  return student;
};

/**
 * Updates a student's name in the database.
 */
export const updateStudent = async ({ id, newName }) => {
  const { error } = await supabase
    .from('students')
    .update({ name: newName })
    .eq('id', id);

  if (error) {
    console.error('Error updating student:', error);
    throw new Error('Failed to update student: ' + error.message);
  }
  return true;
};

/**
 * Deletes a student entry from the database using their ID.
 */
export const deleteStudent = async (id) => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting student:', error);
    throw new Error('Failed to delete student: ' + error.message);
  }
  return true;
};