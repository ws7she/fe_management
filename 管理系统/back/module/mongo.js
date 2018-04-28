const mongoDB = require('mongodb');

let normalDbCli = {};

function getDb(addr) {
    return new Promise((resolve, reject) => {
        if (!normalDbCli[addr]) {
            init(addr).then(db => {
                normalDbCli[addr] = db;
                resolve(normalDbCli[addr]);
            });
        } else {
            resolve(normalDbCli[addr]);
        }
    });
}

function init(addr, option) {
    return new Promise((resolve, reject) => {
        let MongoClient = mongoDB.MongoClient;
        MongoClient.connect(addr, option, function(err, database) {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                resolve(database);
            }
        });
    });
}

function initNormal(id, addr, option) {
    return new Promise((resolve, reject) => {
        init(addr, option).then(db => {
            db.__logID__ = id;
            normalDbCli[id] = db;
            resolve(db);
        }).catch(err => {
            reject(err);
        });
    });
}

function close(db) {
    delete normalDbCli[db.__logID__];
    db.close();
}

module.exports = {
    init,
    initNormal,
    getDb
};

