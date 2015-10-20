var app = require('./src/app.js');

app.start({
	baseName: phantom.args[0],
	url: phantom.args[1]
});
