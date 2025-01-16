// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const app = express();
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/chatApp', { useNewUrlParser: true, useUnifiedTopology: true });

// const UserSchema = new mongoose.Schema({
//     username: String,
//     password: String,
// });
// const User = mongoose.model('User', UserSchema);

// // Signup API
// app.post('/signup', async (req, res) => {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword });
//     await user.save();
//     res.status(201).json({ message: 'User created' });
// });

// // Login API
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (user && await bcrypt.compare(password, user.password)) {
//         const token = jwt.sign({ username }, 'secretKey');
//         res.status(200).json({ token });
//     } else {
//         res.status(401).json({ message: 'Invalid credentials' });
//     }
// });

// app.listen(8000, () => console.log('Auth server running on port 8000'));
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');   

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chatApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Signup endpoint
app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({ username: req.body.username, password: hashedPassword });
        await user.save();
        res.status(201).send('User created');
    } catch (err) {
        res.status(400).send('Error creating user');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(400).send('Invalid credentials');
        }
        const token = jwt.sign({ username: user.username }, 'secretKey');
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send('Error logging in');
    }
});

// Start the server
app.listen(8000, () => console.log('Auth server running on http://localhost:8000'));
