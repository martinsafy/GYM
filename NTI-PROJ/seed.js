// سكريبت بيملّي الداتابيز ببيانات تجريبية + حساب أدمن
// طريقة التشغيل:  npm run seed

require('dotenv').config();
const connectDB = require('./src/config/db');
const User = require('./src/models/user.model');
const GymClass = require('./src/models/class.model');
const Trainer = require('./src/models/trainer.model');

const trainers = [
  { name: 'Ahmed Samir', speciality: 'strength', experienceYears: 8, bio: 'Certified strength and conditioning coach.', phone: '01012345678' },
  { name: 'Mona Khaled', speciality: 'yoga', experienceYears: 6, bio: 'Vinyasa and Hatha yoga instructor.', phone: '01023456789' },
  { name: 'Omar Fathy', speciality: 'boxing', experienceYears: 10, bio: 'Former national boxing champion.', phone: '01034567890' },
  { name: 'Sara Adel', speciality: 'cardio', experienceYears: 4, bio: 'HIIT and cardio specialist.', phone: '01045678901' },
];

const classes = [
  { title: 'Morning HIIT Blast', trainer: 'Sara Adel', category: 'cardio', level: 'intermediate', price: 400, duration: 45, capacity: 25, rating: 4.7, schedule: 'Sun, Tue, Thu - 7:00 AM', description: 'High intensity interval training to kickstart your day and burn maximum calories.' },
  { title: 'Powerlifting Fundamentals', trainer: 'Ahmed Samir', category: 'strength', level: 'beginner', price: 600, duration: 60, capacity: 15, rating: 4.9, schedule: 'Mon, Wed - 6:00 PM', description: 'Learn squat, bench press and deadlift with proper form and safety.' },
  { title: 'Sunrise Yoga Flow', trainer: 'Mona Khaled', category: 'yoga', level: 'beginner', price: 350, duration: 50, capacity: 20, rating: 4.8, schedule: 'Daily - 6:30 AM', description: 'Gentle flow to improve flexibility, balance and mental focus.' },
  { title: 'Boxing Bootcamp', trainer: 'Omar Fathy', category: 'boxing', level: 'advanced', price: 700, duration: 75, capacity: 12, rating: 4.6, schedule: 'Sat, Mon, Wed - 8:00 PM', description: 'Intense boxing drills, pad work and conditioning for experienced athletes.' },
  { title: 'CrossFit WOD', trainer: 'Ahmed Samir', category: 'crossfit', level: 'advanced', price: 800, duration: 60, capacity: 18, rating: 4.5, schedule: 'Sun to Thu - 5:00 PM', description: 'Workout of the day - constantly varied functional movements at high intensity.' },
  { title: 'Core Pilates', trainer: 'Mona Khaled', category: 'pilates', level: 'intermediate', price: 450, duration: 55, capacity: 16, rating: 4.4, schedule: 'Tue, Thu - 5:30 PM', description: 'Strengthen your core, improve posture and prevent back pain.' },
];

const seed = async () => {
  try {
    await connectDB();

    await Trainer.deleteMany();
    await GymClass.deleteMany();
    await User.deleteMany();

    await Trainer.insertMany(trainers);
    await GymClass.insertMany(classes);

    // ملاحظة: بنستخدم create مش insertMany عشان الـ pre('save') يهاش الباسورد
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@gym.com',
      password: 'admin12345',
      phone: '01000000000',
      role: 'admin',
    });

    await User.create({
      firstName: 'Test',
      lastName: 'Member',
      email: 'member@gym.com',
      password: 'member12345',
      phone: '01111111111',
      role: 'member',
    });

    console.log('Database seeded successfully.');
    console.log('Admin  -> admin@gym.com  / admin12345');
    console.log('Member -> member@gym.com / member12345');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
