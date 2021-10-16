const https = require('follow-redirects').https;

export function trySendData(data) {
    console.log("\nSend this anonymous statistics? y/n (y)\n");
    console.log(JSON.stringify(data));

    const stdin = process.stdin;

    stdin.setRawMode(true);

    stdin.resume();
    stdin.setEncoding('ascii');

    stdin.on('data', function (key: any) {
        if (key === 'N' || key === 'n') {
            process.exit();
        } else {
            sendData(data);
        }
    });
}

export function sendData(data) {
    const options = {
        'method': 'POST',
        'hostname': 'ng-app-counter.firebaseio.com',
        'path': '/counter.json',
        'headers': {
            'Content-Type': 'application/json'
        },
        'maxRedirects': 20
    };

    const req = https.request(options, function (res) {
        res.on("data", function (chunk) {
            process.exit();
        });

        res.on("end", function (chunk) {
            process.exit();
        });

        res.on("error", function (error) {
            process.exit();
        });
    });

    const postData = JSON.stringify({...data, date: new Date()});

    req.write(postData);

    req.end();
}

