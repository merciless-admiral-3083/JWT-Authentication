require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const posts = [
    {
        username: 'Kyle',
        title: 'Post 1',
    },
    {
        username: 'Jim',
        title: 'Post 2',
    }
];

app.get('/posts',authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username == req.user.name))
});



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token part

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
}


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
