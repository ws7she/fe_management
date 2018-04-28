const fs = require('fs');
const toml = require('toml');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const lodash = require('lodash');
const cors = require('koa2-cors');
const router = require('koa-router')();
const mongodb = require('./module/mongo');

const app = new Koa();
app.use(bodyParser());

app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        return 'http://localhost:8080'; 
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

router.post('/api/login', async function (ctx) {
    let params = ctx.request.body;
    let mongoCli = await mongodb.getDb('mongodb://localhost:27017'),
        data;

    if(params.isAdmin) {
        data =  await mongoCli.collection('admin').find({'id': params.id}).toArray();
    } else {
        data =  await mongoCli.collection('user').find({'id': params.id}).toArray();
    }

    let obj = lodash.find(data, ['id', params.id]);
    
    if(obj) {
        if(obj.password == params.password) {
            ctx.body = {
                success: 0,
                msg: '登陆成功'
            }
        } else {
            ctx.body = {
                success: 1,
                msg: '密码错误，请重试'
            }
        }
    } else {
        ctx.body = {
            success: 1,
            msg: '学号不存在，请确认学号'
        }
    }
});

router.post('/api/queryme', async function (ctx) {
    let params = ctx.request.body;
    let mongoCli = await mongodb.getDb('mongodb://localhost:27017'),
        data;

    if(params.isAdmin) {
        data =  await mongoCli.collection('admin').find({'id': params.id}).toArray();
    } else {
        data =  await mongoCli.collection('user').find({'id': params.id}).toArray();
    }

    let obj = lodash.find(data, ['id', params.id]);
    
    if(obj) {
        ctx.body = {
            success: 0,
            msg: '查询成功',
            data: obj
        }
    } else {
        ctx.body = {
            success: 1,
            msg: '查询fail'
        }
    }
});

router.post('/api/updatePsd', async function (ctx) {
    let params = ctx.request.body;
    try{
        if(params.isAdmin) {
            await mongo.collection('admin').update(
                {id: params.id},
                {$set: {
                    password: params.password
                }}
            )
            ctx.body = {
                success: 0,
                msg: '修改成功'
            }
        } else {
            await mongo.collection('user').update(
                {id: params.id},
                {$set: {
                    password: params.password
                }}
            )
            ctx.body = {
                success: 0,
                msg: '修改成功'
            }
        }
    } catch(e) {
        ctx.body = {
            success: 1,
            msg: '修改失败'
        }
    }
});
router.post('/api/logData', async function (ctx) {
    let params = ctx.request.body;
    try{
        let mongoCli = await mongodb.getDb('mongodb://localhost:27017'),
            data = await mongoCli.collection('user').find().toArray();
        if(params.type != 'school') {
            let groups = lodash.groupBy(data, item => {
                return item[params.type]
            });
            let v = [];
            lodash.forEach(groups, (item, keys) => {
                if(keys) {
                    v.push(item.length)
                }
            });
            ctx.body = {
                success: 0,
                msg: '请求成功',
                xAxis: lodash.compact(Object.keys(groups)),
                yAxis: [{
                    name: '就业人数',
                    data: v
                }]
            }
        } else {
            let schools = lodash.groupBy(data, item => {
                return item[params.type]
            });
            let companys = Object.keys(lodash.groupBy(data, item => {
                return item.company;
            }));
            let m = [];
            lodash.forEach([true, false], c => {
                let arr = []
                lodash.forEach(schools, (s, k) => {
                    let val = 0;
                    lodash.forEach(s, b=> {
                        if(!lodash.isEmpty(b.company) == c) {
                            val++;
                        }
                    });
                    arr.push(val)
                });
                console.log(c)
                if(c == 1) {
                    m.push({
                        name: '已就业人数',
                        data: arr
                    })
                } else {
                    m.push({
                        name: '未就业人数',
                        data: arr
                    })
                }
                
            })
            ctx.body = {
                success: 0,
                msg: '请求成功',
                xAxis: lodash.compact(Object.keys(schools)),
                yAxis: m
            }
        }
        
        
    } catch(e) {
        console.log(e)
    }
});
router.post('/api/logHistory', async function (ctx) {
    let params = ctx.request.body;
    try{
        let mongoCli = await mongodb.getDb('mongodb://localhost:27017'),
            data = await mongoCli.collection('user').find().toArray();
        let groups = lodash.groupBy(data, item => {return item.graduation} )
        let v = lodash.map(groups, (item, keys) => {
            let a = [];
            lodash.forEach(item, m => {
                if(m.company.length > 0) {
                    a.push(m)
                }
            })
            return a.length / item.length * 100;
        });
        let b = lodash.map(groups, (item, keys) => {
            let a = [],b = [];
            lodash.forEach(item, m => {
                m.sex == '女' ? b.push(m) : ''
                if(m.company.length > 0 && m.sex == '女') {
                    a.push(m)
                }
            })
            return a.length / b.length * 100;
        });
        let n = lodash.map(groups, (item, keys) => {
            let a = [],b = [];
            lodash.forEach(item, m => {
                m.sex == '男' ? b.push(m) : ''
                if(m.company.length > 0  && m.sex == '男') {
                    a.push(m)
                }
            })
            return a.length / b.length * 100;
        });
        ctx.body = {
            success: 0,
            msg: '请求成功',
            xAxis: Object.keys(groups),
            yAxis: [{
                name: '全部就业率',
                data: v
            },{
                name: '男生就业率',
                data: n
            }, {
                name: '女生就业率',
                data: b
            }]
        }
    } catch(e) {
        
    }
});

router.post('/api/logNation', async function (ctx) {
    let params = ctx.request.body;
    try{
        let mongoCli = await mongodb.getDb('mongodb://localhost:27017'),
            data = await mongoCli.collection('user').find().toArray();
        let groups = lodash.groupBy(data, item => {return item.nation} )
        let v = lodash.map(groups, (item, keys) => {
            return [keys, item.length]
        });
        
        ctx.body = {
            success: 0,
            msg: '请求成功',
            series: [{
                type: 'pie',
                name: '民族占比',
                data: v
            }]
        }
    } catch(e) {
        
    }
});


router.post('/api/logBirth', async function (ctx) {
    let params = ctx.request.body;
    try{
        let mongoCli = await mongodb.getDb('mongodb://localhost:27017'),
            data = await mongoCli.collection('user').find().toArray();
        let groups = lodash.groupBy(data, item => {return item.birthplace} );
        let times = Object.keys(lodash.groupBy(data, item => {return item.graduation} ));
        
        let m = [];
        lodash.forEach(times, t => {
            let arr = [];
            lodash.forEach(groups, (item, key) => {
                let val = 0;
                lodash.forEach(item, d => {
                    if(d.graduation == t) {
                        val++;
                    }
                });
                arr.push(val);
            });
            m.push({
                name: t,
                data: arr
            })
        })
        ctx.body = {
            success: 0,
            msg: '请求成功',
            xAxis: Object.keys(groups),
            yAxis: m
        }
    } catch(e) {
        console.log(e)
    }
});


router.post('/api/register', async function (ctx) {
    let params = ctx.request.body;
    let mongoCli = await mongodb.getDb('mongodb://localhost:27017'),
        data = await mongoCli.collection('user').find({'id': params.id}).toArray();
    if(lodash.find(data, ['id', params.id])) {
        ctx.body = {
            success: 1,
            msg: '学号已存在'
        }
    } else {
        try {
            await mongo.collection('user').insert(params);
            ctx.body = {
                success: 0,
                msg: '注册成功'
            }
        } catch(e) {
            ctx.body = {
                success: 1,
                msg: e
            }
        }
    }
    
});
router.post('/api/getInfo', async function (ctx) {
    let params = ctx.request.body;
    let keys = {};
    if(!params.isAdmin){
        keys.id = params.id
    }
    
    if(params.college) keys.college = params.college
    if(params.major) keys.major = params.major
    if(params.year) keys.graduation = params.year.toString();
    console.log(keys)
    
    try{
        let mongoCli = await mongodb.getDb('mongodb://localhost:27017'),
            data = params.isAdmin ? await mongoCli.collection('user').find(keys).toArray() : await mongoCli.collection('user').find(keys).toArray();
        ctx.body = {
            success: 0,
            msg: '成功',
            arr: data
        }
    } catch(e) {
        ctx.body = {
            success: 1,
            msg: e
        }
    }
});
router.post('/api/jiuyeUpdate', async function (ctx) {
    let params = ctx.request.body;
    try{
        await mongo.collection('user').update(
            {id: params.id},
            {$set: params},
            false,
            true
        );
        ctx.body = {
            success: 0,
            msg: '成功'
        }
    } catch(e) {
        ctx.body = {
            success: 1,
            msg: e
        }
    }
});
router.post('/api/jiuyeCreate', async function (ctx) {
    let params = ctx.request.body;
    try{
        await mongo.collection('user').insert(params);
        ctx.body = {
            success: 0,
            msg: '成功'
        }
    } catch(e) {
        ctx.body = {
            success: 1,
            msg: e
        }
    }
});

router.post('/api/delete', async function (ctx) {
    let params = ctx.request.body;
    try{
        await mongo.collection('user').remove({'id': params.id});
        ctx.body = {
            success: 0,
            msg: '成功'
        }
    } catch(e) {
        ctx.body = {
            success: 1,
            msg: e
        }
    }
});
app
    .use(router.routes())
    .use(router.allowedMethods());

(async() => {
    let db = await mongodb.init('mongodb://localhost:27017');
    global.mongo = db;
    // console.log(db)
    app.listen(3000);
})()