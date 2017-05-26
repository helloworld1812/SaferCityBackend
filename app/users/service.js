const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
});

const User = mongoose.model('User', userSchema);

/**
 * Adds user to storage
 * @returns newly created user
 */
const create = user => (User.create(user));

/** Returns user by id */
const find = id => (User.findOne({ _id: id }));

/** Replaces user by id with given new one */
const update = (id, newUser) => (User.findOneAndUpdate({ _id: id }, newUser).exec());

/** Removes user by id */
const remove = id => (User.findOneAndRemove({ _id: id }).exec());

module.exports = {
  create,
  find,
  update,
  remove,
};
