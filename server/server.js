var express = require('express');

// CREATE APP
var app = express();

app.use(express.static('./public'));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    next();
});

app.listen(process.env.PORT || 3000, function() {
    if (process.env.PORT) {
        console.log("Express server is up on port " + process.env.PORT);
    } else {
        console.log("Express server is up on port 3000");

    }
});
