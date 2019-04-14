// Dependencies
import express from 'express';
import mongojs from 'mongojs';
import htmlRoutes from './routes/htmlRoutes';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;
// Database configuration
const databaseUrl = 'newsScraper';

// Hook mongojs configuration to the db variable
const db = mongojs(databaseUrl);
db.on('error', (error) => {
  throw error;
});

// Initialize express html routes
htmlRoutes();

// Listen on port 3000
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('App running on port', PORT);
});
