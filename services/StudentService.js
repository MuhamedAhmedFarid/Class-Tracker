import { supabase } from '@/lib/supabase';

// NEW: Static list of default profile picture URLs
const DEFAULT_AVATAR_POOL = [
  'https://randomuser.me/api/portraits/lego/1.jpg', // The "lego kind of picture"
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/45.jpg',
  'https://randomuser.me/api/portraits/men/76.jpg',
  'https://randomuser.me/api/portraits/women/3.jpg',
  'https://randomuser.me/api/portraits/men/1.jpg',
  'https://randomuser.me/api/portraits/women/4.jpg',
  'https://randomuser.me/api/portraits/women/11.jpg',
  'https://randomuser.me/api/portraits/lego/5.jpg',
  'https://randomuser.me/api/portraits/lego/7.jpg',
];

// Helper function to format the database TIME string into a display string (e.g., "09:30 AM")
const formatTimeForDisplay = (timeString) => {
  if (!timeString) return "N/A";
  try {
    const [hoursStr, minutesStr, period] = timeString.split(/[: ]+/).filter(Boolean);
    let hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);
    
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    
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

const getTodayDayAbbreviation = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date().getDay()];
}

/**
 * --- READ OPERATIONS ---
 */

/**
 * Fetches all students data from Supabase for the Students list page.
 */
export const fetchStudentsFromSupabase = async ({ queryKey }) => {
  const [key, searchQuery] = queryKey;
    
  let query = supabase
    .from('students')
    .select('id, name, image_url, last_session_time, hourly_rate, days_of_week')
    .order('name', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching students:', error);
    throw new Error('Failed to load students.');
  }
  
  // Map Supabase database fields to component props expected by StudentItem.jsx
  return data.map((student, index) => ({
    id: student.id,
    name: student.name,
    // FIX: Cycle through default avatars if image_url is null
    image: student.image_url || DEFAULT_AVATAR_POOL[index % DEFAULT_AVATAR_POOL.length],
    time: formatSessionTime(student.last_session_time),
    hourlyRate: student.hourly_rate,
    daysOfWeek: student.days_of_week,
  }));
};

/**
 * Fetches students scheduled for today's classes (for the Home/Index page).
 */
export const fetchTodayStudentsScheduled = async () => {
    const todayAbbr = getTodayDayAbbreviation();
    
    const { data, error } = await supabase
        .from('students')
        .select(`id, name, days_of_week`)
        .contains('days_of_week', [todayAbbr])
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching today's scheduled students:", error);
        throw new Error(`Failed to load scheduled students for ${todayAbbr}.`);
    }

    return data.map(student => ({
        name: student.name,
        // Mock time fields as actual schedules are not granularly saved per day in the 'students' table
        startDate: '10:00 AM', 
        endDate: '12:00 PM',
        current: false, 
    }));
};

/**
 * --- WRITE OPERATIONS ---
 */

/**
 * Creates a new student entry in the database.
 */
export const createNewStudent = async ({ studentName, selectedDays, amount, fromTime, toTime }) => {
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