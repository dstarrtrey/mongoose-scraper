/* eslint-disable no-console */
// Dependencies
import express from 'express';
import { connect, connection } from 'mongoose';
import path from 'path';
// import { graphqlHTTP } from 'graphql';
import htmlRoutes from './routes/htmlRoutes';
import apiRoutes from './routes/apiRoutes';
// import Schema from './graphql/Schema';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(path.join(__dirname, 'public')));

// Database configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/newsScraper';
connect(MONGODB_URI, { useNewUrlParser: true });
connection.on('error', () => console.log('---FAILED to connect to mongoose'));
connection.once('open', () => {
  console.log('+++Connected to mongoose');
});

// Initialize express html routes
htmlRoutes(app);
apiRoutes(app);

// Listen on port 3000
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('App running on port', PORT);
});
