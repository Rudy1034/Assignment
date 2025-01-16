// const jwt = require('jsonwebtoken');

// io.on('connection', (socket) => {
//     const token = socket.handshake.query.token;
//     if (!token) {
//         socket.disconnect();
//         return;
//     }

//     try {
//         const user = jwt.verify(token, 'secretKey');
//         users[socket.id] = user.username;
//         console.log(`${user.username} connected`);
//     } catch (err) {
//         console.log('Invalid token');
//         socket.disconnect();
//     }
// });

// const io = require('socket.io')(8001, {
//     cors: {//cross origin resource sharing
//         origin: "http://127.0.0.1:5500",
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });
// const users={};

// io.on('connection',socket=>{
//     socket.on('new-user-joined',username=>{
//         console.log("new user",username);
//         users[socket.id]=username;
//         socket.broadcast.emit('user-joined',username);
//     });
//     socket.on('send',message=>{
//         socket.broadcast.emit('receive',{message: message, username: users[socket.id]})
//     });
    
//     socket.on('disconnect',message=>{
//         socket.broadcast.emit('left',users[socket.id]);
//         delete users[socket.id];
//     });
// })
// const io = require('socket.io')(8001, {
//     cors: {
//         origin: "http://127.0.0.1:5500",
//         methods: ["GET", "POST"],
//         credentials: true,
//     },
// });
// const jwt = require('jsonwebtoken');
// const users = {};

// io.on('connection', (socket) => {
//     const token = socket.handshake.query.token;
//     if (!token) {
//         socket.disconnect();
//         return;
//     }

//     try {
//         const user = jwt.verify(token, 'secretKey');
//         users[socket.id] = user.username;
//         socket.broadcast.emit('user-joined', user.username);

//         socket.on('send', (message) => {
//             socket.broadcast.emit('receive', { message, username: users[socket.id] });
//         });

//         socket.on('disconnect', () => {
//             socket.broadcast.emit('left', users[socket.id]);
//             delete users[socket.id];
//         });
//     } catch (err) {
//         socket.disconnect();
//     }
// });
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const { Server } = require('socket.io');

// const app = express();
// const PORT_AUTH = 8002;
// const PORT_CHAT = 8001;
// const JWT_SECRET = 'your_jwt_secret';

// const users = {};
// const onlineUsers = {};

// // MongoDB connection
// //mongoose.connect('mongodb://localhost:27017/chatApp', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb://localhost:27017/chatApp');


// const userSchema = new mongoose.Schema({
//     username: { type: String, unique: true },
//     password: String,
// });

// const User = mongoose.model('User', userSchema);

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Signup route
// app.post('/signup', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ username, password: hashedPassword });
//         await user.save();
//         res.status(201).send('User registered successfully');
//     } catch (error) {
//         res.status(400).send('Username already exists');
//     }
// });

// // Login route
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ username });
//         if (user && (await bcrypt.compare(password, user.password))) {
//             const token = jwt.sign({ username }, JWT_SECRET);
//             res.json({ username, token });
//         } else {
//             res.status(401).send('Invalid credentials');
//         }
//     } catch (error) {
//         res.status(500).send('Error logging in');
//     }
// });

// app.listen(PORT_AUTH, () => {
//     console.log(`Authentication server running on http://localhost:${PORT_AUTH}`);
// });

// // Chat server
// const io = new Server(PORT_CHAT, {
//     cors: { origin: "http://127.0.0.1:5500", methods: ["GET", "POST"] },
// });

// io.on('connection', (socket) => {
//     socket.on('new-user-joined', (username) => {
//         users[socket.id] = username;
//         onlineUsers[socket.id] = username;
//         io.emit('update-user-list', Object.values(onlineUsers));
//     });

//     socket.on('send', (message) => {
//         socket.broadcast.emit('receive', { message, username: users[socket.id] });
//     });

//     socket.on('private-message', ({ to, message }) => {
//         const recipientSocket = Object.keys(users).find((key) => users[key] === to);
//         if (recipientSocket) {
//             io.to(recipientSocket).emit('private-message', { from: users[socket.id], message });
//         }
//     });

//     socket.on('disconnect', () => {
//         delete onlineUsers[socket.id];
//         io.emit('update-user-list', Object.values(onlineUsers));
//         delete users[socket.id];
//     });
// });

// console.log(`Chat server running on http://localhost:${PORT_CHAT}`);
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const PORT_AUTH = 8002;
const PORT_CHAT = 8001;
const JWT_SECRET = 'your_jwt_secret';

const users = {};
const onlineUsers = {};

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chatApp');

// User schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.json());
app.use(cors());

// Signup route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send('Username already exists');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ username }, JWT_SECRET);
            res.json({ username, token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

app.listen(PORT_AUTH, () => {
    console.log(`Authentication server running on http://localhost:${PORT_AUTH}`);
});

// Chat server
const io = new Server(PORT_CHAT, {
    cors: { origin: "http://127.0.0.1:5500", methods: ["GET", "POST"] },
});

io.on('connection', (socket) => {
    socket.on('new-user-joined', (username) => {
        users[socket.id] = username;
        onlineUsers[socket.id] = username;
        io.emit('update-user-list', Object.values(onlineUsers));
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message, username: users[socket.id] });
    });

    socket.on('private-message', ({ to, message }) => {
        const recipientSocket = Object.keys(users).find((key) => users[key] === to);
        if (recipientSocket) {
            io.to(recipientSocket).emit('private-message', { from: users[socket.id], message });
        }
    });

    socket.on('disconnect', () => {
        delete onlineUsers[socket.id];
        io.emit('update-user-list', Object.values(onlineUsers));
        delete users[socket.id];
    });
});

console.log(`Chat server running on http://localhost:${PORT_CHAT}`);
