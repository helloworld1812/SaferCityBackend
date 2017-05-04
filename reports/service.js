const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  title: String,
});

const Report = mongoose.model('Report', reportSchema);

/**
 * Adds report to storage
 * @returns newly created report
 */
const create = report => (Report.create(report));

/** Returns all entities in storage */
const list = () => (Report.find().exec());

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
