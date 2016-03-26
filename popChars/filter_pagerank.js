var fs = require('fs');
var json = JSON.parse(fs.readFileSync('pagerank_normalized_json.txt', 'utf8'));
var result = [];
var keys = Object.keys(json);
keys.forEach(function(key){
    result.push({
        "name" : key,
        "score" : json[key]
    })
});
console.log(result.length);
result.sort(function (a, b) {
    return parseFloat(b.score) - parseFloat(a.score);
});
result = result.filter(function(element, index, array){
    return element.score >= 0.1;
});


fs.writeFileSync('popChars.json', JSON.stringify(result, null, 4));