var http = require('http');
var url = require('url');
var handles = require('./controller');

http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    var pathname = url.parse(req.url).pathname;
    var paths = pathname.split('/');
    var controller = paths[2] || 'index';
    var action = paths[3] || 'index';
    var pathname = url.parse(req.url).pathname;
    console.log(pathname, controller, action);
    // console.log(JSON.stringify(req.headers));
    if(paths[1] == 'xynode' && handles[controller] && handles[controller][action]){
        handles[controller][action].call(null, req, res);
    } else {
        res.writeHead(404,{'Content-Type': 'text/html'});
        res.end('<html><body><h1>走丢啦~</h1></body></html>');
    }

    // res.writeHead(200, {
    //     'Content-Type': 'text/plain'
    // });
    // res.end('hello world');

    // switch (req.method) {
    //     // 设置了cors跨域
    //     // post请求时，浏览器会先发一次options请求，如果请求通过，则继续发送正式的post请求
    //     case 'OPTIONS':

    //         res.statusCode = 200
    //         res.end('test')
    //         break;

    //     case 'GET':
    //         req.on('data', function (chunk) {
    //             console.log(chunk);
    //         })
    //         let data = JSON.stringify(req.headers)
    //         res.write(data)
    //         res.end()
    //         break;
    //     case 'POST':
    //         let item = ''
    //         req.on('data', function (chunk) {
    //             item += chunk
    //         })
    //         req.on('end', function () {
    //             // 存入
    //             item = JSON.parse(item)
    //             items.push(item.item)
    //             // 返回到客户端
    //             let data = JSON.stringify(items)
    //             res.write(data)
    //             res.end()
    //         })
    //         break;
    // }
}).listen(1337, '127.0.0.1');