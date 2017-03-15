var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// img path
var imgPath = './2000x500_02._SL1280___.jpg';
var I_name='rose';
var I_price='15';
// connect to mongo
mongoose.connect('localhost', 'demo');
var app=express();
var bodyparser=require('body-parser');
app.use(express.static(__dirname + '/static'));
var server2=app.listen('9090',()=>{console.log('index server up');});
// example schema
var schema = new Schema({
    img: { data: Buffer, contentType: String },
    name: { type: String },
    price:{type: String}
});

// our model
var A = mongoose.model('A', schema,'demoimg');

mongoose.connection.on('open', function () {
  console.error('mongo is open');

  // empty the collection
  //A.remove(function (err) 
  {
    //if (err) throw err;

  console.error('removed old docs');

    // store an img in binary in mongo
    var a = new A;
    a.img.data = fs.readFileSync(imgPath);
    a.img.contentType = 'image/png';
    a.name=I_name;
    a.price=I_price;
    a.save(function (err, a) {
      if (err) throw err;

      console.error('saved img to mongo');

      // start a demo server
      var server = express.createServer();
      app.get('/img', function (req, res, next) {
        A.findById(a, function (err, doc) {
          if (err) return next(err);
         res.contentType(doc.img.contentType);
         //res.send(doc.name);

        res.send(doc.img.data ) ;
         //res.send(doc.name);
        });
      });
      app.get('/name', function (req, res, next) {
        A.findById(a, function (err, doc) {
          if (err) return next(err);
          console.log("before send")
         //res.contentType(doc.img.contentType);
         //var j={"name":doc.name,"price":doc.price};
         //res.send(j);
         //es.send(doc.img.data ) ;
         res.send(doc);
         console.log("after send");
        });
      });

      //server.on('close', function () {
        //console.error('dropping db');
        //mongoose.connection.db.dropDatabase(function () {
         // console.error('closing db connection');
          //mongoose.connection.close();
        //});
      //});

      server.listen(3333, function (err) {
       // var address = server.address();
       // console.error('server listening on http://%s:%d', address.address, address.port);
        console.error('press CTRL+C to exit');
      });

      process.on('SIGINT', function () {
        server.close();
      });
    });
  }

});
