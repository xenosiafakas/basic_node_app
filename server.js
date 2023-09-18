const app = require('./app.js');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

//console.log(process.env);

const port = process.env.port;

app.listen(port, () => {
  console.log(`Running on port ${port}...`);
});
