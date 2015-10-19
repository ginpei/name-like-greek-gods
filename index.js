var url = 'https://ja.wikipedia.org/wiki/%E3%82%AE%E3%83%AA%E3%82%B7%E3%82%A2%E7%A5%9E%E8%A9%B1';

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
	var prefix = 'サカナ';

	var delimiter = prefix[prefix.length-1];

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

	function showNames(names) {
		for (var i=0, l=names.length; i<l; i++) {
			console.log('-', names[i]);
		}
	}

	function injectSakana(names) {
		var injecteds = [];
		for (var i=0, l=names.length; i<l; i++) {
			var name = names[i];
			var index = name.indexOf(delimiter);
			var injected = prefix + name.slice(index+1);
			injecteds.push(injected);
		}
		return injecteds;
	}

	console.log('OK');
	page.evaluate(function() {
		console.log('#', document.title);
	});
	var texts = page.evaluate(function() {
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

	var kataWords = getKataWords(texts.join(' '));
	var names = unique(kataWords);
	var filteredNames = filterByNa(names);
	var namesFilteredNicely = filterNicely(filteredNames);
	var sakanaNames = injectSakana(namesFilteredNicely);
	showNames(sakanaNames);

	console.log('done.');
});

console.log('Fetching...');
console.log(url);
