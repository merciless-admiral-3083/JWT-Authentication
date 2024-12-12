require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let refreshTokens=[]

app.post('/token', (req,res) => {
    const refreshToken = req.body.token
    if(refreshToken==null) return res.sendStatus(401)
        if(!refreshToken.includes(refreshToken)) return res.sendStatus(403)
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.sendStatus(403);
                const accessToken = generateAccessToken({name: user.name})
            res.json({accessToken: accessToken})
    })            
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
  }
  
  app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});

//Now we need to add an expiry time for the code else anyone will be able to access the token anytime
