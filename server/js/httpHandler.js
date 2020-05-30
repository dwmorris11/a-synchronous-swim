const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const handler = require('./keypressHandler.js');
const q = require('./messageQueue.js');
const nodeStatic = require('node-static');

// const file = new nodeStatic.Server('../server/background');


// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
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

      // res.end('http://127.0.0.1:3000/js/background.jpg');
      let readStream = fs.createReadStream(path.join(__dirname, 'background.jpg'));
      // readStream.on('open', () => {
      //   // res.setHeader('Content-Type', 'image/jpeg');
      readStream.pipe(res);
      // });

      // fs.readFile(path.join(__dirname, 'background.jpg'), (err, data) => {
      //   if (err) {
      //     console.error(err, 'readFile error', __dirname);
      //     return;
      //   }
      //   res.end(data);
      // });



      // res.writeHead(200, {
      //   'Content-Type': 'image/jpeg',
      //   "access-control-allow-origin": "*",
      //   "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
      //   "access-control-allow-headers": "*",
      //   "access-control-max-age": 10
      // });

      return;
      //======================
      // req.addListener('end', () => {
      //   file.serve(req, res, (err, response) => {
      //     res.end(file.serveFile('/background.jpg', 200, {}, req, res));
      //   });
      // }).resume();
      //======================
      // fs.readFile('..' + req.url + '/background.jpg', (err, data) => {
      //   console.log('..' + req.url + '/background.jpg');
      //   if (err) {
      //     res.writeHead(404);
      //     res.end(JSON.stringify(err));
      //     return;
      //   }
      //   res.writeHead(200);
      //   res.end(data);
      // });
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
