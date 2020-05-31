const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const handler = require('./keypressHandler.js');
const q = require('./messageQueue.js');
const nodeStatic = require('node-static');

// const file = new nodeStatic.Server('../server/background');


// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join(__dirname, 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);


  if (req.url === '/background') {
    if (req.method === 'GET') {

      res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
        "access-control-allow-headers": "*",
        "access-control-max-age": 10
      });

      let readStream = fs.createReadStream(module.exports.backgroundImageFile);
      readStream.on('error', (err)=> {
        console.log('test');
        res.writeHead(404, headers);
        res.end(err);
      });
      readStream.pipe(res);

      return;
    }
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end('');
  } else if (req.method === 'GET') {
    res.writeHead(200, headers);
    var dequeued = q.dequeue(); //make accessible to test below
    res.end(dequeued);
  } else {
    res.writeHead(200, headers);
    res.end('not GET or OPTIONS - no action');
  }

  next(dequeued); // invoke next() at the end of a request to help with testing!
};
