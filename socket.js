function startSocket(io) {

    io.on('connection', () => {
        console.log("wow");
    });

    io.on('connection', function (socket) {
        console.log("a new conection")

        socket.on('keyPressed', function (data) {
            io.to(data.room).emit('playNote', data.path);
            console.log(data);
        })

        socket.on('joinRoom', function (id) {
            socket.join(id);
        })

        socket.on('leaveRoom', function (id) {
            socket.leave(id);
        })
        // socket.on("login", function (name) {
        //     socket.username = name.trim();
        //     socket.emit("welcome", socket.username);
        // });


        //   socket.on("joinRoom", function (room) {
        //     if (socket.username) {
        //       if (socket.rooms['1'] || socket.rooms['2']) {
        //         let currentRoom = socket.rooms['1'] ? '1' : '2';
        //         console.log("currentroom", currentRoom)
        //         if (currentRoom !== room) {
        //           socket.leave(currentRoom);
        //           socket.emit("leftRoom", String((Number(room)) % 2 + 1));
        //           socket.broadcast.to(currentRoom).emit("newUser", socket.username + " has left Room " + currentRoom + ".");

        //           socket.emit("joinedRoom", room);
        //           socket.broadcast.to(room).emit("newUser", socket.username + " has joined Room " + room + ".");
        //         }
        //       }
        //       else if (!socket.rooms['1'] && !socket.rooms['2']) {
        //         socket.emit("joinedRoom", room);
        //         socket.broadcast.to(room).emit("newUser", socket.username + " has joined Room " + room + ".");
        //       }
        //       socket.join(room);
        //       socket.emit("changeRoom", room);

        //       // console.log(socket.rooms);
        //     }
        //   });

        //   socket.on("message", function (msg) {
        //     if (socket.username && (socket.rooms['1'] || socket.rooms['2'])) {
        //       let currentRoom = socket.rooms['1'] ? '1' : '2';
        //       io.to(currentRoom).emit("serverMsg", socket.username + " said: " + msg);
        //       // console.log(msg);
        //     }
        //   });

        // });

    });
}
module.exports = startSocket;
