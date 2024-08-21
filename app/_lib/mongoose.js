import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error('Mongoose can not be connected');

const DB = MONGODB_URI.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
};

export default connectToDatabase;
