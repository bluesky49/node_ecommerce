const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', err =>
  console.error(`DB Connect Error - ${err.message}`)
);

// TODO: Add path to our different models to have it available throughout the application
require('./models/Shovelee');
require('./models/Shoveler');
require('./models/Listing');
require('./models/Bid');

const app = require('./app');
app.set('port', process.env.PORT || 4000);
const server = app.listen(app.get('port'), () => {
  console.log(`Up and running on PORT:${server.address().port}`);
});
