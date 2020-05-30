const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const handler = require('./keypressHandler.js');
const q = require('./messageQueue.js');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.writeHead(200, headers);
  if (req.method === 'OPTIONS') {
    res.end('');
  } else if (req.method === 'GET') {
    var dequeued = q.dequeue(); //make accessible to test below
    res.end(dequeued);
  } else {
    res.end('not GET or OPTIONS');
  }

  next(dequeued); // invoke next() at the end of a request to help with testing!
};
