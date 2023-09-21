const mongoose = require('mongoose');
const app = require('./app.js');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
//console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connection successful');
  });

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
