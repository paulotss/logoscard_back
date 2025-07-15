import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '..', `.env.${process.env.NODE_ENV}`)
});

import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));