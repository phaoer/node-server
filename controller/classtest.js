var async = require('async');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

var hasbody = function (req) {
    return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
}

var mime = function (req) {
    var str = req.headers['content-type'] || '';
    return str.split(';')[0];
}

module.exports = {
    userinfo: function (req, res) {
        var sendData = {}
        async.series([(callback) => { //parallel
            fs.readFile(path.resolve(__dirname, '..' + "/userinfo.json"), callback);
        }, (callback) => {
            fs.readFile(path.resolve(__dirname, '..' + "/other.json"), callback);
        }], (err, data) => {
            var arr = JSON.parse(data[0].toString()); //buffer转字符串再传json
            var obj = JSON.parse(data[1].toString());
            for (let i = 0; i < arr.length; i++) {
                for (let attr2 in obj) {
                    if (attr2 == arr[i]['id']) {
                        arr[i]['vt'] = obj[attr2]['viptime'];
                    }
                }
            }
            sendData.data = arr;
            sendData.id = 1;
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(sendData));
        });
    },
    adduser: function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        if (mime(req) == 'application/x-www-form-urlencoded') {
            if (hasbody(req)) {
                var buffers = [];
                req.on('data', (chunk) => {
                    buffers.push(chunk);
                });

                req.on('end', (chunk) => {
                    req.rawBody = Buffer.concat(buffers).toString(); //请求体内容
                    req.body = querystring.parse(req.rawBody); //请求体内容 转json

                    fs.readFile(path.resolve(__dirname, '..' + "/userinfo.json"), (err, data) => {
                        var arr = JSON.parse(data.toString()); //文件内容buffer 转字符串 再转json
                        arr.push(req.body);

                        var arrstring = JSON.stringify(arr); //新文件内容转字符串

                        fs.writeFile(path.resolve(__dirname, '..' + "/userinfo.json"), arrstring, function (err) {
                            if (!err) {
                                res.end(JSON.stringify({
                                    id: 1,
                                    msg: '新增成功'
                                }));
                            }
                        })
                    });

                });
            } else {
                res.end(JSON.stringify({
                    id: -1,
                    msg: '缺少用户信息'
                }));
            }
        } else {
            res.end(JSON.stringify({
                id: -1,
                msg: '错误的提交方式'
            }));
        }
    },
    uploadimg: function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        if (mime(req) == 'multipart/form-data') {
            if (hasbody(req)) {
                var form = new formidable.IncomingForm();

                form.uploadDir = path.resolve(__dirname, '../tmp/');
                form.maxFieldsSize = 2*1024*1024;
                form.maxFields = 1000;
                form.keepExtensions = true;

                form.parse(req, (err, fields, files) => {
                    if(!err){
                        res.end(JSON.stringify({
                            id: 1,
                            msg: '上传成功'
                        }));
                    }
                    req.body = fields;
                    req.files = files;
                    console.log(fields, files);
                })       
            } else {
                res.end(JSON.stringify({
                    id: -1,
                    msg: '上传图片不能为空'
                }));
            }
        } else {
            res.end(JSON.stringify({
                id: -1,
                msg: '错误的提交方式'
            }));
        }
    }
}