/** Provides function that returns promise that connects to MongoDB. */

const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://dev:dev@ds125481.mlab.com:25481/safercity';

module.exports.connect = () => new Promise((resolve, reject) => {
  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    mongoose.disconnect();
    return reject('Connection to MongoDB failed');
  });
  mongoose.connection.once('open', () => resolve());
});
