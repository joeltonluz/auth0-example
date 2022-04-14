const express = require('express');
const cors = require('cors');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());

const verifyJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS_URI,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ['RS256'],
}).unless({path: ['/']})

app.use(verifyJwt);

app.get('/', (req, res) => {
  res.send('Opa, rota pública')
});

app.get('/protected', async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1]
    const response = await axios.get('https://test-in8.us.auth0.com/userInfo', {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });
    const userInfo = response.data
    console.log(userInfo)
    res.send(userInfo)
  }catch (error) {
    res.send(error.message)
  }
});

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  const status = error.status || 500
  const message = error.message || 'Internal server error'
  res.status(status).send(message)
})

const port = process.env.SERVER_PORT || 4000
app.listen(port, () => console.log(`Server on port ${port}`));