/* global beforeEach, test, expect */
const service = require('./service');

const events = [
  { title: 'Free wine!' },
  { title: 'BrainCandyLive' },
];

test('"create" creates event', () => {
  const id1 = service.create(events[0]);
  expect(id1).toBeDefined();
  const id2 = service.create(events[1]);
  expect(id2).toBeDefined();
});

test('"list" returns all entities', () => {
  expect(service.list()).toEqual(events);
});

test('"find" returns object for existing id', () => {
  expect(service.find(1)).toEqual(events[0]);
});

test('"find" throws an exception if non existing id is provided', () => {
  expect(() => service.find(-1)).toThrow();
});

test('"Update" updates event for exising id', () => {
  const updatedEvent = { title: 'Updated' };
  service.update(2, updatedEvent);
  expect(service.find(2)).toEqual(updatedEvent);
});

test('"Update" throws an exception if non existing id is provided', () => {
  expect(() => service.update(3, { title: 'Updated' })).toThrow();
});

test('"Remove" removes event with existing id', () => {
  service.remove(1);
  expect(service.list().length).toEqual(1);
});

test('"Remove" hrows an exception if non existing id is provided', () => {
  expect(() => service.remove(3)).toThrow();
});
