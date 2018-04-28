var KoaRouter = require('koa-router');
var path = require('path');
var fse = require('fs-extra');

var apiRouter = new KoaRouter({
    prefix: '/api'
});
var rs = [{
    path: './api',
    router: apiRouter
}];

function loadCtrls() {
    return new Promise((resolve, reject) => {
        var count = 0;
        rs.forEach((r) => {
            var p = path.join(__dirname, r.path);
            fse.walk(p)
                .on('data', (item) => {
                    var isNotFile = !item.stats.isFile;
                    if (isNotFile) {
                        return
                    }
                    var itemPath = path.parse(item.path);
                    var isJs = itemPath.ext === '.js';
                    var isCtrl = /\.ctrl$/.test(itemPath.name);
                    var isNotControllerFile = !isJs || !isCtrl;
                    if (isNotControllerFile) {
                        return;
                    }
                    var ctrls = require(item.path);
                    ctrls.forEach((c) => {
                        r.router[c.method](c.path, c.handler);
                    });
                })
                .on('end', () => {
                    count += 1;
                    if (count === rs.length) {
                        console.log('controller init!');
                        resolve();
                    }
                });
        });
    });
}

function bind(app, cb) {
    loadCtrls().then(function() {
        rs.forEach((r) => {
            app.use(r.router.routes());
        });
        cb();
    });
}
module.exports = {
    bind
};