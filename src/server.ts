import app from './app';
import { config } from './config';
import { seedDatabase } from './seed';

const start = async () => {
  await seedDatabase();
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

// Always start — Passenger requires this file, so require.main === module is false
// but Passenger still expects the server to bind
start().catch((err) => {
  console.error(err);
  process.exit(1);
});

export default app;
module.exports = app;