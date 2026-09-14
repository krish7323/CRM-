import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Batch from '../models/Batch.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Initializing single Master Owner/Admin account for production...');
      const defaultPassword = await bcrypt.hash('password123', 10);

      await User.create({
        name: 'Dinesha & Niresh',
        email: 'admin@elh.edu',
        phone: '+91 98765 43210',
        passwordHash: defaultPassword,
        role: 'Admin',
        designation: 'Director',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        isActive: true,
      });
      console.log('Master Owner/Admin account created successfully (Dinesha & Niresh - admin@elh.edu).');
    }

    // Seed Default Courses if none exist
    const courseCount = await Course.countDocuments();
    let gerCourse, freCourse, engCourse;
    if (courseCount === 0) {
      console.log('Seeding initial European language courses...');
      gerCourse = await Course.create({
        code: 'GER',
        name: 'German Language Program',
        description: 'Goethe & CEFR German A1-B2 preparation',
        cefrLevels: ['A1', 'A2', 'B1', 'B2'],
        baseFee: 25000,
        totalHours: 120,
      });

      freCourse = await Course.create({
        code: 'FRE',
        name: 'French Language Program',
        description: 'DELF A1-B2 comprehensive language track',
        cefrLevels: ['A1', 'A2', 'B1', 'B2'],
        baseFee: 25000,
        totalHours: 120,
      });

      engCourse = await Course.create({
        code: 'ENG',
        name: 'Business English & Public Speaking',
        description: 'Professional communication & IELTS training',
        cefrLevels: ['B1', 'B2', 'C1'],
        baseFee: 20000,
        totalHours: 80,
      });
      console.log('Initial courses seeded.');
    } else {
      gerCourse = await Course.findOne({ code: 'GER' });
      freCourse = await Course.findOne({ code: 'FRE' });
      engCourse = await Course.findOne({ code: 'ENG' });
    }

    if (!gerCourse) {
      gerCourse = (await Course.findOne()) || (await Course.create({
        code: 'GER',
        name: 'German Language Program',
        description: 'Goethe German',
        cefrLevels: ['A1', 'A2', 'B1'],
        baseFee: 25000,
        totalHours: 120,
      }));
    }

    // Seed Default Batches if none exist
    const batchCount = await Batch.countDocuments();
    if (batchCount === 0) {
      console.log('Seeding initial active batches with capacity...');
      await Batch.create([
        {
          code: 'GER-A1-B01',
          courseId: gerCourse._id,
          courseName: gerCourse.name,
          level: 'A1',
          room: 'Aryabhata Hall (Room 102)',
          days: ['Mon', 'Wed', 'Fri'],
          timing: '09:00 AM - 11:00 AM',
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 86400000),
          maxStudents: 15,
          currentEnrolledCount: 0,
          teacherName: 'Prof. Amit Kulkarni',
          status: 'Ongoing',
        },
        {
          code: 'FRE-A1-B01',
          courseId: freCourse ? freCourse._id : gerCourse._id,
          courseName: freCourse ? freCourse.name : 'French Language Program',
          level: 'A1',
          room: 'Room 103',
          days: ['Tue', 'Thu', 'Sat'],
          timing: '11:30 AM - 01:30 PM',
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 86400000),
          maxStudents: 15,
          currentEnrolledCount: 0,
          teacherName: 'Prof. Johann Weber',
          status: 'Ongoing',
        },
        {
          code: 'ENG-B1-B01',
          courseId: engCourse ? engCourse._id : gerCourse._id,
          courseName: engCourse ? engCourse.name : 'Business English & Public Speaking',
          level: 'B1',
          room: 'Room 104',
          days: ['Mon', 'Tue', 'Thu'],
          timing: '03:00 PM - 05:00 PM',
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 86400000),
          maxStudents: 20,
          currentEnrolledCount: 0,
          teacherName: 'Prof. Amit Kulkarni',
          status: 'Ongoing',
        },
      ]);
      console.log('Initial batches seeded with capacity tracking.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
