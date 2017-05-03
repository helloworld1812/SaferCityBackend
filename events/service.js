const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  title: String,
});

const Event = mongoose.model('Event', eventSchema);

/**
 * Adds event to storage
 * @returns newly created event
 */
const create = event => (Event.create(event));

/** Returns all entities in storage */
const list = () => (Event.find().exec());

/** Returns event by id */
const find = id => (Event.findOne({ _id: id }));

/** Replaces event by id with given new event */
const update = (id, newEvent) => (Event.findOneAndUpdate(
  { _id: id }, newEvent).exec());

/** Removes event by id */
const remove = (id) => (Event.findOneAndRemove({ _id: id }).exec());

module.exports = {
  create,
  list,
  find,
  update,
  remove,
};
