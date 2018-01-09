var express = require('express');

// CREATE APP
var app = express();

app.use(express.static('./public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(process.env.PORT || 3000, function() {
    if (process.env.PORT) {
        console.log("Express server is up on port " + process.env.PORT);
    } else {
        console.log("Express server is up on port 3000");

    }
});
