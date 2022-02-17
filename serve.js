const http = require('http')
const fs = require('fs')
const ioHook = require('iohook');

const PORT = 808

http.createServer((request, response) => {
    console.log(request.url)
    if (request.url == "/three") request.url = "/node_modules/three/build/three.module.js"

    fs.readFile(`.${request.url}`, (err, data) => {

        if (err) {
            console.log("failed")
            response.writeHeader(404, {
                'Content-Type': 'text/plain'
            })
            response.write('404 Not Found')
            response.end()
            return
        }

        if (request.url.endsWith('.html')) {
            response.writeHeader(200, {
                'Content-Type': 'text/html'
            })
        }

        if (request.url.endsWith('.js')) {
            console.log("es un js")
            response.writeHeader(200, {
                'Content-Type': 'application/javascript'
            })
        }

        response.write(data)
        response.end()
    })
}).listen(PORT)


const WebSocket = require('ws');
const ws_server = new WebSocket.Server({
    port: 8081
});

let sockets = [];
ws_server.on('connection', function (socket) {
    sockets.push(socket);

    // When you receive a message, send that message to every socket.
    // socket.on('message', function (msg) {
    //     sockets.forEach(s => s.send(msg));
    // });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', function () {
        sockets = sockets.filter(s => s !== socket);
    });
});

var keys = [];

ioHook.on("keydown", event => {
    keys[event.rawcode] = true;
    updateKeys();
});

ioHook.on("keyup", event => {
    console.log(event.rawcode)
    keys[event.rawcode] = false;
    updateKeys();
});


function updateKeys() {
    let msg = JSON.stringify(keys)
    sockets.forEach(s => s.send(msg))

}

ioHook.start();
