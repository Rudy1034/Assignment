// const socket=io('http://localhost:8001');
// const form=document.getElementById('send-container');
// const messageInput=document.getElementById('messageInp')
// const messageContainer=document.querySelector(".container")
// var audio=new Audio('notificationSound.mp3');

// const append=(message,position)=>{
//     const messageElement=document.createElement('div');
//     messageElement.innerText=message;
//     messageElement.classList.add('message');
//     messageElement.classList.add(position);
//     messageContainer.append(messageElement);
//     if(position=='left'){
//         audio.play();
//     }
// }

// form.addEventListener('submit',(e)=>{
//     e.preventDefault();
//     const message=messageInput.value;
//     append(`You: ${message}`, 'right');
//     socket.emit('send',message);
//     messageInput.value=''
// })

// const username=prompt("Enter your name to join the chat");
// socket.emit('new-user-joined',username);

// socket.on('user-joined',username=>{
//     append(`${username} joined the chat`,'left')
// })

// socket.on('receive',data=>{
//     append(`${data.username}: ${data.message}`,'left')
// })

// socket.on('left',username=>{
//     append(`${username} has left the chat`,'left')
// })
// const socket = io('http://localhost:8001');
// const form = document.getElementById('send-container');
// const messageInput = document.getElementById('messageInp');
// const messageContainer = document.querySelector(".container");
// const authContainer = document.getElementById('auth-container');
// var audio = new Audio('notificationSound.mp3');

// // Function to append messages to the chat
// const append = (message, position) => {
//     const messageElement = document.createElement('div');
//     messageElement.innerText = message;
//     messageElement.classList.add('message');
//     messageElement.classList.add(position);
//     messageContainer.append(messageElement);
//     if (position === 'left') {
//         audio.play();
//     }
// };

// // Handle signup form submission
// document.getElementById('signup-form').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const username = document.getElementById('signup-username').value;
//     const password = document.getElementById('signup-password').value;

//     const res = await fetch('http://localhost:8000/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//     });

//     if (res.ok) {
//         alert('Signup successful! Please log in.');
//     } else {
//         alert('Signup failed.');
//     }
// });

// // Handle login form submission
// document.getElementById('login-form').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const username = document.getElementById('login-username').value;
//     const password = document.getElementById('login-password').value;

//     const res = await fetch('http://localhost:8000/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//     });

//     if (res.ok) {
//         const { token } = await res.json();
//         localStorage.setItem('token', token);
//         alert('Login successful!');
//         connectSocket(token); // Connect to the chat server
//     } else {
//         alert('Login failed.');
//     }
// });

// // Function to connect the chat socket
// const connectSocket = (token) => {
//     authContainer.style.display = 'none';
//     document.querySelector('.container').style.display = 'block';
//     document.querySelector('nav').style.display = 'block';
//     document.querySelector('.send').style.display = 'block';

//     const socket = io('http://localhost:8001', { query: { token } });

//     form.addEventListener('submit', (e) => {
//         e.preventDefault();
//         const message = messageInput.value;
//         append(`You: ${message}`, 'right');
//         socket.emit('send', message);
//         messageInput.value = '';
//     });

//     socket.on('user-joined', (username) => {
//         append(`${username} joined the chat`, 'left');
//     });

//     socket.on('receive', (data) => {
//         append(`${data.username}: ${data.message}`, 'left');
//     });

//     socket.on('left', (username) => {
//         append(`${username} has left the chat`, 'left');
//     });
// };
const socket = io('http://localhost:8001');
const authContainer = document.getElementById('auth-container');
const chatContainer = document.getElementById('chat-container');
const messageContainer = document.querySelector('.container');
const messageInput = document.getElementById('messageInp');
const userList = document.getElementById('user-list');
const menuToggle = document.getElementById('menu-toggle');
var audio=new Audio('notificationSound.mp3');
let loggedInUser = null;

// Append message to chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);
};

// Signup
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        alert('Signup successful! Please login.');
    } else {
        alert('Signup failed. Try a different username.');
    }
});

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        loggedInUser = data.username;
        socket.emit('new-user-joined', loggedInUser);
        authContainer.style.display = 'none';
        chatContainer.style.display = 'block';
    } else {
        alert('Login failed. Check your credentials.');
    }
});

// Update user list


// Toggle side menu
menuToggle.addEventListener('click', () => {
    document.getElementById('side-menu').classList.toggle('open');
});

// socket.on('update-user-list', (users) => {
//     userList.innerHTML = '';
//     users.forEach((user) => {
//         if (user !== loggedInUser) {
//             const li = document.createElement('li');
//             li.textContent = user;
//             li.addEventListener('click', () => startPrivateChat(user));
//             userList.appendChild(li);
//         }
//     });
// });

// Handle private messages
function startPrivateChat(recipient) {
    const privateMessage = prompt(`Send private message to ${recipient}:`);
    if (privateMessage) {
        socket.emit('private-message', { to: recipient, message: privateMessage });
    }
}

socket.on('private-message', (data) => {
    append(`Private from ${data.from}: ${data.message}`, 'left');
});

// Send message
document.getElementById('send-container').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
    if (position === 'left') {
        audio.play();
   }
});

// Handle received messages
socket.on('receive', (data) => {
    append(`${data.username}: ${data.message}`, 'left');
    if (position === 'left') {
         audio.play();
    }
});




