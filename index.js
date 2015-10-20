var defaultUrl = 'https://ja.wikipedia.org/wiki/%E3%82%AE%E3%83%AA%E3%82%B7%E3%82%A2%E7%A5%9E%E8%A9%B1';
var defaultBaseName = 'サカナ';

var baseName = phantom.args[0] || defaultBaseName;
var url = phantom.args[1] || defaultUrl;

var delimiter = baseName[baseName.length-1];


var webpage;
try {
	webpage = require('webpage');
}
catch (error) {
	console.log('Use phantomjs instead of node. Like this:');
	console.log('  $ phantomjs index.js');
	process.exit(1);
}

var page = webpage.create();
page.onConsoleMessage = function(msg) {
	console.log(msg);
};
page.open(url, function(status) {
	console.log('OK');
	console.log('#', getDocumentTitle());

	var texts = getMainTexts();
	var kataWords = getKataWords(texts.join(' '));
	var names = unique(kataWords);
	var filteredNames = filterByNa(names);
	var namesFilteredNicely = filterNicely(filteredNames);
	var allResultNames = injectBaseName(namesFilteredNicely);
	var resultNames = unique(allResultNames);

	for (var i=0, l=resultNames.length; i<l; i++) {
		console.log('-', resultNames[i]);
	}

	console.log('done.');
});

console.log('Fetching...');
console.log(url);

// --------------------------------

function getDocumentTitle() {
	return page.evaluate(function() {
		return document.title;
	});
}

function getMainTexts() {
	return page.evaluate(function() {
		var TEXT_NODE = document.TEXT_NODE;
		var ELEMENT_NODE = document.ELEMENT_NODE;
		function getTextNode(el, results) {
			if (!results) {
				results = [];
			}

			var children = el.childNodes;
			for (var i=0, l=children.length; i<l; i++) {
				var child = children[i];
				if (child === null) {
					continue;
				}
				else if (child.nodeType === ELEMENT_NODE) {
					getTextNode(child, results);
				}
				else if (child.nodeType === TEXT_NODE) {
					results.push(child.textContent);
				}
			}

			return results;
		}

		var elMain = document.querySelector('#mw-content-text');
		var texts = getTextNode(elMain);
		return texts;
	});
}

function getKataWords(text) {
	var rxKata = /[ア-ンヴー]+/g;
	var names = text.match(rxKata) || [];
	return names;
}

function unique(names) {
	var filtered = [];
	var hash = {};

	for (var i=0, l=names.length; i<l; i++) {
		var name = names[i];
		if (!(name in hash)) {
			hash[name] = true;
			filtered.push(name);
		}
	}

	return filtered;
}

function filterByNa(names) {
	var filtered = [];
	for (var i=0, l=names.length; i<l; i++) {
		var name = names[i];
		if (name.indexOf(delimiter) >= 0) {
			filtered.push(name);
		}
	}
	return filtered;
}

function filterNicely(names) {
	var deniedSufixes = [delimiter, delimiter+'イ', delimiter+'ー'];
	var filtered = [];
	for (var i=0, l=names.length; i<l; i++) {
		var name = names[i];
		var ok = true;
		for (var j=0, m=deniedSufixes.length; j<m; j++) {
			var sufix = deniedSufixes[j];
			if (name.indexOf(sufix) === name.length-sufix.length) {
				ok = false;
				break;
			}
		}
		if (ok) {
			filtered.push(name);
		}
	}
	return filtered;
}

function injectBaseName(names) {
	var injecteds = [];
	for (var i=0, l=names.length; i<l; i++) {
		var name = names[i];
		var index = name.indexOf(delimiter);
		var injected = baseName + name.slice(index+1);
		injecteds.push(injected);
	}
	return injecteds;
}
