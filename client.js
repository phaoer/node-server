var http = require('http');

const options = {
    hostname:'127.0.0.1',
    port:'1337',
    path:'/',
    method:'POST',
    body:{
        a:'test'
    }
};

const req = http.request(options, (res) => {
    // console.log(res.statusCode);
    // console.log(JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(chunk);
    })
});

req.end();