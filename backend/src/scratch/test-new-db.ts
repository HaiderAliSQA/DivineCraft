import mongoose from 'mongoose';

async function testNewDb() {
  const uri = 'mongodb+srv://haidersqa98_db_user:3JjmtFuSpegYP9oI@divinecrafters.9roj7wm.mongodb.net/divenecraft?retryWrites=true&w=majority&appName=DivineCrafters';
  try {
    console.log('Testing connection to:', uri);
    await mongoose.connect(uri);
    console.log('SUCCESS: Connected to new database!');
    
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections:', collections.map(c => c.name));
    } else {
      console.log('mongoose.connection.db is undefined');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('FAILED to connect to new database:', err);
    process.exit(1);
  }
}

testNewDb();
