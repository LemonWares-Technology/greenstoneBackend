import app from './app';
import { config } from './config';
import { seedDatabase } from './seed';

const start = async () => {
  // Seed the database from .env credentials and demo data
  await seedDatabase();

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

start();
