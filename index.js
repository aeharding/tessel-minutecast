// Import the interface to Tessel hardware
var tessel = require('tessel');
var Npx = require('npx');
var npx = new Npx(60);
var hexRgb = require('hex-rgb');
// var request = require('request');

// // Set the led pins as outputs with initial states
// // Truthy initial state sets the pin high
// // Falsy sets it low.
// // var led1 = tessel.led[0].output(1);
// // var led2 = tessel.led[1].output(0);

// var request = require('request');
// // var cheerio = require('cheerio');

// request('http://news.ycombinator.com', function (error, response, html) {
//   if (!error && response.statusCode == 200) {
//     console.log(html);
//   }
// });

var http = require('http');

var count = 1;

function start () {
  http.get("http://minutecast-heebiejeebies.rhcloud.com/", function (res) {    
    var bufs = [];
    res.on('data', function (data) {
      bufs.push(new Buffer(data));
      console.log('# received', new Buffer(data).toString());
    })
    res.on('end', function () {
      getRgbs(JSON.parse(bufs[0].toString()));
    })
  }).on('error', function (e) {
    console.log('not ok -', e.message, 'error event')
    setImmediate(start);
  });
}

setInterval(start, 60 * 1000);
start();

function getRgbs(arr) {
  var a = npx.newAnimation(1);

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== "#fff") {
      a.setPixel(i, hexRgb(arr[i]));
    }
  }

  npx.play(a);
}
 