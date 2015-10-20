var app = require('./src/app.js');

var args;
try {
	args = phantom.args;
}
catch (error) {
	console.log('Use phantomjs instead of node. Like this:');
	console.log('  $ phantomjs index.js');
	process.exit(1);
}

app.start({
	baseName: args[0],
	url: args[1]
});
