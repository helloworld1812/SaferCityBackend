const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  title: String,
  location: String,
  time: Date,
  details: String,
  dangerous: Boolean,
});

const Report = mongoose.model('Report', reportSchema);

const LIST_LIMIT = 10;

/**
 * Adds report to storage
 * @returns newly created report
 */
const create = report => (Report.create(report));

/** Returns LIST_LIMIT entities in storage with time before specified one */
const list = before => (
  Report.find({ time: { $lt: before } }).limit(LIST_LIMIT).sort('-time').exec());

/** Returns report by id */
const find = id => (Report.findOne({ _id: id }));

/** Replaces report by id with given new report */
const update = (id, newReport) => (Report.findOneAndUpdate(
  { _id: id }, newReport).exec());

/** Removes report by id */
const remove = id => (Report.findOneAndRemove({ _id: id }).exec());

module.exports = {
  create,
  list,
  find,
  update,
  remove,
};
