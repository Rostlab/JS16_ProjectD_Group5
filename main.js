var fs = require('fs');
var configured = false;
module.exports = {
    init: function (params) {
        var config = {
            "twitter": {
                "consumer_key": params.consumerkey,
                "consumer_secret": params.consumersecret,
                "access_token_key": params.accesstokeykey,
                "access_token_secret": params.accesstokensecret
            },
            "database": {
                "user": params.user,
                "password": params.password,
                "port": params.port,
                "uri": params.uri,
                "name": params.name
            },
            "databaseA": {
                "token": params.tokenToA
            }
        };
        fs.writeFileSync(filename, JSON.stringify(config, null, 4), function (err) {
            if (err) {
                console.log(err);
            } else {
                return require('./index.js');
            }
        });
    }
};