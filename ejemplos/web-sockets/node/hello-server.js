var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});

  var obj = {
  	format: 'text',
  	title: 'Content Title',
  	data: 'This is the data text.'
  };

  res.end(JSON.stringify(obj));
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');