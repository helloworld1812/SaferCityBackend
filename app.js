var http = require('http');

http.createServer(function(req, res) {

  if (req.url === '/api/events') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var event = {
      title: 'Free wine!'
    };
    res.end(JSON.stringify(event));
  }
  else {
    res.writeHead(404);
    res.end();
  }

}).listen(8080, '127.0.0.1');