const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  reportId: mongoose.Schema.Types.ObjectId,
  text: String,
  time: Date,
  user: String,
});

const Comment = mongoose.model('Comment', commentSchema);

/**
 * Adds comment to storage
 * @returns newly created comment
 */
const create = comment => (Comment.create(comment));

/** Returns all entities in storage by provided criteria */
const list = searchParams => (Comment.find(searchParams).sort('-time').exec());


/** Replaces report by id with given new report */
const update = (id, newComment) => (Comment.findOneAndUpdate(
  { _id: id }, newComment).exec());

/** Removes report by id */
const remove = id => (Comment.findOneAndRemove({ _id: id }).exec());

module.exports = {
  create,
  list,
  update,
  remove,
};
