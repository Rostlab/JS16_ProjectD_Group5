var fs = require('fs');
var configured = false;
var retObject;
module.exports = {
    init: function (params) {
        if (!configured) {
            fs.writeFileSync("cfg/config.json", JSON.stringify(params, null, 4), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    configured = true;
                }
            });
            retObject = require('./index.js');
        }
        return retObject;
    }
};