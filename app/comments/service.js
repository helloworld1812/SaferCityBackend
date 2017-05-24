const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  reportId: mongoose.Schema.Types.ObjectId,
  text: String,
  time: Date,
  user: String,
});

const Comment = mongoose.model('Comment', commentSchema);

const LIST_LIMIT = 10;

/**
 * Adds comment to storage
 * @returns newly created comment
 */
const create = comment => (Comment.create(comment));

/** Returns all entities in storage by provided criteria */
const list = (reportId, before) => (Comment.find(
  { reportId, time: { $lt: before } }).sort('-time').limit(LIST_LIMIT).exec());


/** Replaces comment by id with given new one */
const update = (id, newComment) => (Comment.findOneAndUpdate(
  { _id: id }, newComment).exec());

/** Removes comment by id */
const remove = id => (Comment.findOneAndRemove({ _id: id }).exec());

module.exports = {
  create,
  list,
  update,
  remove,
};
