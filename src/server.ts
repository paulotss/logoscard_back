import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '..', `.env.${process.env.NODE_ENV}`)
});

import app from './app';
import sequelize from './database/models';

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to the database has been established successfully');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }

  console.log(`Listening on port ${PORT}`);
});