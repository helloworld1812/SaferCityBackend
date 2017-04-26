/**
 * Entity-based service.
 * Provides methods to store, modify, and retrieve events entity
 */

// TODO: replace with DB
const storage = {};

/**
 * Adds event to storage
 * @returns newly created event id
 */
const create = (event) => {
  const id = Object.keys(storage).length + 1;
  storage[id] = event;
  return id;
};

/** Returns all entities in storage */
const list = () => (Object.keys(storage).map(key => storage[key]));

/** Returns event by id */
const find = (id) => {
  if (!storage[id]) {
    throw new Error(`No event with id "${id}" exists`);
  }
  return storage[id];
};

/** Replaces event by id with given new event */
const update = (id, newEvent) => {
  if (!storage[id]) {
    throw new Error(`No event with id "${id}" exists`);
  }
  storage[id] = newEvent;
};

/** Removes event by id */
const remove = (id) => {
  if (!storage[id]) {
    throw new Error(`No event with id "${id}" exists`);
  }
  delete storage[id];
};

module.exports = {
  create,
  list,
  find,
  update,
  remove,
};
