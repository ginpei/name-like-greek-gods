var app = require('./src/app.js');

var args = process.argv;

app.start({
	baseName: args[2],
	url: args[3]
});
