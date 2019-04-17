/* eslint-disable no-console */
// Dependencies
import express from 'express';
import { connect, connection } from 'mongoose';
// import { graphqlHTTP } from 'graphql';
import htmlRoutes from './routes/htmlRoutes';
// import Schema from './graphql/Schema';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// app.use('/graphql', graphqlHTTP(() => ({
//   Schema,
//   graphiql: true,
// })));

// Database configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/newsScraper';

connect(MONGODB_URI, { useNewUrlParser: true });
const db = connection;
db.on('error', () => console.log('---FAILED to connect to mongoose'));
db.once('open', () => {
  console.log('+++Connected to mongoose');
});

// Initialize express html routes
htmlRoutes(app);

// Listen on port 3000
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('App running on port', PORT);
});
