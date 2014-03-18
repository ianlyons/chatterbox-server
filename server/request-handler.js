/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var url = require('url');
//var qs = require('querystring');
var saveMsgObj = {};
saveMsgObj.results = [];



exports.handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  console.log("Serving request type " + request.method + " for url " + request.url);
  var statusCode = 200;
  var path = url.parse(request.url).pathname;
  console.log('path:', path, 'request.method:', request.method);


  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'text/plain';

  if(request.method === 'GET'){
    if(request.url === '/log'){
      // status code 200
      response.writeHead(statusCode, headers);
      response.end();
    }else if(request.url.substring(0,8) === '/classes'){
      // status code 200
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(saveMsgObj));
    }else{
      // status code 404
      statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end();
    }
  }else if(request.method === 'POST'){
    if(request.url === '/send' || request.url.substring(0,8) === '/classes' ){
      // status code 201
      var tempMsg;
      statusCode = 201;
      console.log("Responding to a post request");
      request.on('data', function(data){
        tempMsg = JSON.parse(data);
        tempMsg.createdAt = new Date();
      });
      request.on('end', function() {
        saveMsgObj.results.unshift(tempMsg);
      });
      response.writeHead(statusCode, headers);
      response.end();
    }
  }else if(request.method === 'OPTIONS'){
    // status code 200
    response.writeHead(statusCode, headers);
    response.end();
  }







  // response.writeHead(statusCode, headers);

  // headers["Content-Type"] = "text/plain";
  // if(request.method === 'POST'){
  //   statusCode = 201;
  //   console.log("Responding to a post request");
  //   request.on('data', function(data){
  //     tempMsg = JSON.parse(data);
  //     tempMsg.createdAt = new Date();
  //   });
  //   request.on('end', function() {
  //     saveMsgObj.results.unshift(tempMsg);
  //   });
  //   //response.statusCode = statusCode;
  // }

  // if(request.method === 'GET'){
  //   console.log('Responding to a GET request...');
  //   console.log('path:', path);
  //   response.write(JSON.stringify(saveMsgObj));
  //   statusCode = 404;
  //   //response.statusCode = statusCode;
  // }



  /* .writeHead() tells our server what HTTP status code to send back */


  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  // response.end();
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
