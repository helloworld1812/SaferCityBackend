/** Provides function that returns promise that connects to MongoDB. */

const mongoose = require('mongoose');
const bluebird = require('bluebird');

// This function is used instead of declaring const MONGO_URI in the beginning
// because dotenv needs time to set up the variables so such uri will have
// all variables as undefined.
const buildMongoUri = () => {
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASS;
  const host = process.env.DB_HOST;
  const name = process.env.DB_NAME;
  return `mongodb://${user}:${pass}@${host}/${name}`;
};

module.exports.connect = () => new Promise((resolve, reject) => {
  mongoose.Promise = bluebird;
  mongoose.connect(buildMongoUri());
  mongoose.connection.on('error', () => {
    mongoose.disconnect();
    return reject('Connection to MongoDB failed');
  });
  mongoose.connection.once('open', () => resolve());
});
