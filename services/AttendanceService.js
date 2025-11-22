import { supabase } from '@/lib/supabase';

/**
 * Fetches a student's profile AND their attendance record for the current date.
 */
export const fetchStudentWithTodayAttendance = async (studentId) => {
    if (!studentId) return null;
    
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // 1. Get the Student Profile
    const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

    if (studentError) throw new Error(studentError.message);

    // 2. Get Attendance Records for Today
    const { data: sessions, error: sessionError } = await supabase
        .from('student_sessions')
        .select('scheduled_day, attended')
        .eq('student_id', studentId)
        .eq('session_date', todayStr);

    if (sessionError) throw new Error(sessionError.message);

    // 3. Merge the data
    // Create a map like: { 'Monday': true, 'Wednesday': false }
    const todayAttendanceMap = {};
    sessions.forEach(session => {
        todayAttendanceMap[session.scheduled_day] = session.attended;
    });

    return {
        ...student,
        todayAttendance: todayAttendanceMap 
    };
};


export const saveAttendance = async (studentId, hourlyRate, attendanceData) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Prepare the data for Supabase
    // attendanceData looks like: { 'Monday': true, 'Wednesday': false }
    const recordsToUpsert = Object.keys(attendanceData).map(day => ({
        student_id: studentId,
        session_date: todayStr,
        scheduled_day: day,
        attended: attendanceData[day],
        amount_charged: attendanceData[day] ? hourlyRate : 0, // Charge if attended
    }));

    if (recordsToUpsert.length === 0) return;

    const { error } = await supabase
        .from('student_sessions')
        .upsert(recordsToUpsert, { onConflict: 'student_id, session_date, scheduled_day' });

    if (error) throw new Error(error.message);
    
    return true;
};