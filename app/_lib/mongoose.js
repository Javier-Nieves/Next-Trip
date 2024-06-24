import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error('Mongoose can not be connected');

const DB = process.env.MONGODB_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

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

// // cached connection prevents multiple instances of the same connection
// // let cached = global.mongoose;

// // if (!cached) {
// //   cached = global.mongoose = { conn: null, promise: null };
// // }

// async function connectToDatabase() {
//   // if connection already exists:
//   // if (cached.conn) {
//   //   console.log('\x1b[32m%s\x1b[0m', 'Connection exists');
//   //   return cached.conn;
//   // }
//   try {
//     console.log('\x1b[36m%s\x1b[0m', 'connection', mongoose.connection);
//     if (mongoose.connection.readyState === 0) {
//       console.log('\x1b[32m%s\x1b[0m', 'Connecting to mongoose...');
//       connection = mongoose.connect(DB, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
//       // .then((mongoose) => {
//       //   return mongoose;
//       // });
//       console.log('DB connection successful!');
//     }
//   } catch (err) {
//     console.log('error', err);
//   }

//   // cached.conn = await cached.promise;
//   // return connection;
// }

// export default connectToDatabase;
