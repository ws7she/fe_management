import qs from 'qs'
const _ = require('lodash')
const axios = require('axios')

const apis = {
    login: {
        url: 'http://localhost:3000/api/login',
        method: 'post'
    },
    register: {
        url: 'http://localhost:3000/api/register',
        method: 'post'
    },
    jiuyeUpdate: {
        url: 'http://localhost:3000/api/jiuyeUpdate',
        method: 'post'
    },
    jiuyeCreate: {
        url: 'http://localhost:3000/api/jiuyeCreate',
        method: 'post'
    },
    getInfo: {
        url: 'http://localhost:3000/api/getInfo',
        method: 'post'
    },
    delete: {
        url: 'http://localhost:3000/api/delete',
        method: 'post'
    },
    queryme: {
        url: 'http://localhost:3000/api/queryme',
        method: 'post'
    },
    updatePsd: {
        url: 'http://localhost:3000/api/updatePsd',
        method: 'post'
    },
    logData: {
        url: 'http://localhost:3000/api/logData',
        method: 'post'
    },
    logHistory: {
        url: 'http://localhost:3000/api/logHistory',
        method: 'post'
    },
    logNation: {
        url: 'http://localhost:3000/api/logNation',
        method: 'post'
    },
    logBirth: {
        url: 'http://localhost:3000/api/logBirth',
        method: 'post'
    }
}

let requester = {};
_.forEach(apis, (theApi, name) => {
    requester[name] = function (params) {
        params = params || {};
        let defaultParams = theApi.defaultParams || {};
        params = _.assign({}, defaultParams, params);
        let req;
        if (theApi.method === 'get') {
            // let url = theApi.url;
            // if(!_.isEmpty(params)) {
            //     params = $.param(params);
            //     url += '?' + params;
            // }
            // req = fetch(url, {
            //     credentials: 'include'
            // })
            let url = theApi.url;
            req = axios.get(url, params)
        } else {
            req = axios({
                method: 'post',
                url: theApi.url,
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
                data: params
            })
            // req = fetch(theApi.url,  {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(params),
            //     credentials: 'include'
            // })
        }
        return req.then(resp => {
            let r;
            try {
                r = resp.data;
            } catch(e) {
                r = resp.text();
            }
            return r;
        }).catch(e => {
            return e.message
        }).then(r => {
            if (r.code == 1 && r.data == 'needLogin') {
                location.href = '/#/login'
            } else if (r.code == 3 && r.data == 'nopermission') {
                location.href = '/#/nopermission'
            } else {
                return r;
            }
        });
    };
});

export default requester;