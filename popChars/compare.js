var wiki = require('./wikilist.json');
var chars = require('./chars.json');
var fs = require('fs');

var result = [];

for (var i = 0; i < wiki.length; i++) {
    for (var j = 0; j < chars.length; j++) {
        if (wiki[i].name === chars[j].name) {
            result.push(wiki[i]);
        }
    }

}

result.sort(function (a, b) {
    return parseFloat(b.score) - parseFloat(a.score);
});
var median;
if (result.length % 2 !== 0) {
    median = parseFloat(result[(result.length + 1) / 2].score);
} else {
    median = 0.5 * (parseFloat(result[result.length / 2]) + parseFloat(result[(result.length / 2) + 1]));
}
console.log('median: ' + median);


var filtered = result.filter(function (element) {
    if (parseFloat(element.score) >= 100) { // can use media instead but result would be too large
        return true
    } else {
        console.log('dropping score of ' + element.name);
        return false;
    }
});

console.log(filtered.length);

//write to file

fs.writeFile('popChars.json', JSON.stringify(filtered, null, 4), function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("success");
    }
});




