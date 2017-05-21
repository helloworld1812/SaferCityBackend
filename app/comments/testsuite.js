/**
 * Integration test suite for comments entity.
 * Intended to be required from app.test.js.
 */

/* global describe, test, expect */
const request = require('superagent');
const mongoose = require('mongoose');

const APP_URL = global.appUrl;

// # Test data
const id1 = mongoose.Types.ObjectId();
const id2 = mongoose.Types.ObjectId();
const comments = [{
  reportId: id1,
  text: 'Hello World',
  time: new Date(2017, 5, 11, 20, 0, 0, 0),  // make sure times are not sorted
  user: 'Alex',
}, {
  reportId: id1,
  text: 'The other comment',
  time: new Date(2017, 3, 15, 11, 15, 0, 0),  // make sure times are not sorted
  user: 'Sonya',
}, {
  reportId: id1,
  text: 'The test',
  time: new Date(2017, 7, 15, 11, 15, 0, 0), // make sure times are not sorted
  user: 'Greg',
}, {
  reportId: id2,
  text: 'Welcome',
  time: new Date(2017, 8, 15, 11, 15, 0, 0), // make sure times are not sorted
  user: 'Alex',
}];

/** Utility function to return id of index-th item */
const id = index => comments[index].id;
/** Utility function to return reportId of index-th item */
const reportId = index => comments[index].reportId;
/** Utility function to return single item with same id */
const commentById = itemId => comments.filter(c => String(c.id) === itemId)[0];
/** Utility function to return items with same reportId */
const commentsByReportId = itemReportId => comments.filter(c => c.reportId === itemReportId);


// # Tests
// Please note: test order matters

// ## Put test data in database
test('/comments POST returns id of newly created item', () => (
  // code below returns promise
  Promise.all(Object.keys(comments).map(index => (
    request.post(`${APP_URL}/comments`)
      .set('Content-Type', 'application/json')
      .send(comments[index])
      .then((resp) => {
        expect(resp.body).toBeDefined();
        comments[index].id = resp.body;
      })
  )))
));

// ## Make sure error is returned for invalid comments
describe('"Comments" validators', () => {
  require('./validators.testsuite'); // eslint-disable-line global-require
});

// ## Make sure we added them and are able to read them
test('/comments?reportId=:reportId GET returns items', () => (
  // code below returns promise
  request.get(`${APP_URL}/comments?reportId=${reportId(0)}`)
    .then((resp) => {
      const receivedComments = resp.body;
      expect(receivedComments.length).toEqual(commentsByReportId(reportId(0)).length);
      receivedComments.forEach((receivedComment) => {
        const comment = commentById(receivedComment._id); // eslint-disable-line
        expect(comment).toBeDefined();
        expect(receivedComment.reportId).toEqual(String(comment.reportId));
        expect(new Date(receivedComment.time)).toEqual(comment.time);
        expect(receivedComment.user).toEqual(comment.user);
      });
    })
));

// ## Make sure list of comments is sorted by time with newest on top
test('/comments GET returns items sorted by time DESC', () => (
  // code below returns promise
  request.get(`${APP_URL}/comments?reportId=${reportId(0)}`)
    .then((resp) => {
      const receivedComments = resp.body;
      let lastTime = Infinity;
      receivedComments.forEach((receivedComment) => {
        const time = (new Date(receivedComment.time)).getTime();
        expect(time).toBeLessThan(lastTime);
        lastTime = time;
      });
    })
));

// ## Check if we can update object by id
test('/comments/:id PUT updates existing id', () => {
  comments[0].text = 'Party';
  return request.put(`${APP_URL}/comments/${id(0)}`)
    .set('Content-Type', 'application/json')
    .send(comments[0])
    .then(() => (
      // When we've updated we would like to check that item is indeed updated
      // So we issue a request to fetch just modified data...
      request.get(`${APP_URL}/comments?reportId=${reportId(0)}`)
    ))
    .then((res) => {
      // ... and then check that it's indeed equal to an updated item
      const receivedComments = res.body;
      const receivedCommentsWithSameId = receivedComments.filter(c => c._id === String(id(0)));  // eslint-disable-line
      expect(receivedCommentsWithSameId.length).toBe(1);
      expect(receivedCommentsWithSameId[0].text).toEqual(comments[0].text);
    });
});

// ## But update by non-existing id returns 404
test('/comments/:id PUT returns 404 error for non-existing id', () => (
  // code below returns promise
  request.put(`${APP_URL}/comments/-1`)
    .set('Content-Type', 'application/json')
    .send(comments[0])
    .then(resp => (Promise.reject(resp))) // Request shouldn't be successful - reject it
    .catch((res) => {
      expect(res.status).toBe(404);
    })
));

// ## Check if we can remove object
test('/comments/:id DELETE removes the entity with existing id', () => (
  request.delete(`${APP_URL}/comments/${id(0)}`)
    .then(() => (
      // When we've removed the item we would like to check that it's indeed removed
      // So we issue a request to fetch list of comments...
      request.get(`${APP_URL}/comments?reportId=${reportId(0)}`)
    ))
    .then((resp) => {
      const updatedComments = resp.body;
      expect(updatedComments.length).toEqual(commentsByReportId(reportId(0)).length - 1);
    })
));

// ## But if we remove by non-existing id we get 404
test('/comments/:id DELETE return 404 error for non-existing id', () => (
  request.delete(`${APP_URL}/comments/-1`)
    .then(resp => (Promise.reject(resp))) // Request shouldn't be successful - reject it
    .catch((res) => {
      expect(res.status).toBe(404);
    })
));
