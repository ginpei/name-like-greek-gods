var client = require('cheerio-httpcli');
var japanese = require('./ja.js');
module.exports = {
	start: function(args) {
		var baseName = args.baseName || japanese.defaultBaseName;
		var url = args.url || japanese.defaultUrl;

		var delimiter = baseName[baseName.length-1];

		console.log('Fetching...');
		console.log(url);
		client.fetch(url, function(err, $, res, body) {
			if (err) {
				console.log('** NG **');
				console.error(err);
				process.exit(0);
			}

			console.log('OK');
			console.log('#', getDocumentTitle($));

			var text = getMainText($);
			var kataWords = getKataWords(text);
			var names = unique(kataWords);
			var filteredNames = filterByNa(names);
			var namesFilteredNicely = filterNicely(filteredNames);
			var allResultNames = injectBaseName(namesFilteredNicely);
			var resultNames = unique(allResultNames);

			for (var i=0, l=resultNames.length; i<l; i++) {
				console.log('-', resultNames[i]);
			}

			console.log('done.');
			process.exit();
		});

		// --------------------------------

		function getDocumentTitle($) {
			return $('title').text();
		}

		function getMainText($) {
			return $('#mw-content-text').text();
		}

		function getKataWords(text) {
			var names = text.match(japanese.rxKata) || [];
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
			var deniedSufixes = [delimiter, delimiter+japanese.longVowel];
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
	}
};
