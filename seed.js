require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/studentapp';

const sampleNames = [
  'Ankit Sharma', 'Priya Mehta', 'Ravi Kumar', 'Sneha Patil',
  'Amit Joshi', 'Neha Sinha', 'Vikram Desai', 'Ruchi Gupta',
  'Kunal Verma', 'Divya Nair', 'Rahul Bansal', 'Pooja Singh',
  'Arjun Kapoor', 'Isha Rawat', 'Manoj Tiwari', 'Tina Thomas',
  'Harshit Goyal', 'Nidhi Agarwal', 'Yash Pandey', 'Meera Dubey'
];

const getRandomCoord = () => ({
  lat: +(19 + Math.random() * 10).toFixed(5), // 19 to 29
  lon: +(72 + Math.random() * 10).toFixed(5), // 72 to 82
});

async function seedStudents() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to DB.');

    console.log('🗑️ Deleting existing students...');
    await Student.deleteMany({});
    console.log('✅ Existing students deleted.');

    const seedData = sampleNames.map(name => {
      const { lat, lon } = getRandomCoord();
      return { name, lat, lon };
    });

    await Student.insertMany(seedData);
    console.log(`🌱 Seeded ${seedData.length} students.`);
    process.exit();
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seedStudents();
