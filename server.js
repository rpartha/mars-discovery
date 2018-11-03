const express = require('express');

var app = express();

app.use(express.static(__dirname + '/', {'extensions': ['html']}));
app.set('strict routing', true);

const port = process.env.PORT || 4000;

app.listen(port, function(){
	console.log("website listening on port " + port + "!");
});