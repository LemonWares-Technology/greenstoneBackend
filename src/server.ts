import app from './app';
import { config } from './config';
import { seedDatabase } from './seed';

// Passenger expects the startup file to export the Express app.
// For local/dev usage, we still start the listener when this file is executed directly.
const start = async () => {
  await seedDatabase();
  app.listen(config.port, () => console.log(`Server is running on port ${config.port}`));
};

if (require.main === module) {
  start().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}

export default app;
// For CommonJS consumers like Passenger's require().
module.exports = app;
