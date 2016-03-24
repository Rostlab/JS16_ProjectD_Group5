var fs = require('fs');
var configured = false;
var retObject;
module.exports = {
    init: function (params) {
        if (!configured) {
            fs.writeFileSync(require('path').resolve(__dirname, './cfg/config.json'), JSON.stringify(params, null, 4));
            configured = true;
            retObject = require('./index.js');
        }
        return retObject;
    }
};