const express = require('express');
const app = express();
http = require('http');
const cors = require('cors');
const { Server } = require('socket.io'); // Add this

app.use(cors()); // Add cors middleware

const server = http.createServer(app); // Add this

// Add this
// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// Add this
// Listen for when the client connects via socket.io-client
io.on('connection', (socket) => {

    console.log(`User connected ${socket.id}`);


    socket.on('join_room', (data) => {
        const { username, room } = data;
        socket.join(room);
    })

    // const CHAT_BOT = 'ChatBot'; // Add this
    // Listen for when the client connects via socket.io-client
    const CHAT_BOT = 'ChatBot';
    // Add this
    let chatRoom = ''; // E.g. javascript, node,...
    let allUsers = []; // All users in current chat room

    io.on('connection', (socket) => {
        console.log(`User connected ${socket.id}`);

        // Add a user to a room
        socket.on('join_room', (data) => {
            const { username, room } = data; // Data sent from client when join_room event emitted
            socket.join(room); // Join the user to a socket room
            console.log("===========>",data);
            // Add this
            let __createdtime__ = Date.now(); // Current timestamp
            // Send message to all users currently in the room, apart from the user that just joined
            socket.to(room).emit('receive_message', {
                message: `${username} has joined the chat room`,
                username: CHAT_BOT,
                __createdtime__,
            });

            socket.emit('receive_message', {
                message: `Welcome ${username}`,
                username: CHAT_BOT,
                __createdtime__,
            });
            chatRoom = room;
            allUsers.push({ id: socket.id, username, room });
            chatRoomUsers = allUsers.filter((user) => user.room === room);
            socket.to(room).emit('chatroom_users', chatRoomUsers);
            socket.emit('chatroom_users', chatRoomUsers);
    
        });

        
    });

    // We can write our socket event listeners in here...
});



server.listen(4000, () => 'Server is running on port 3000');