const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const mongoose = require('mongoose');
const app = require('./app');

// Database connection
const DB_URI = process.env.MONGODB_URI.replace(
  '<password>',
  process.env.MONGODB_PASSWORD
);

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connect to database successful !');
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
