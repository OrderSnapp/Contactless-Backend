const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const packageJson = require('../package.json');
require('dotenv').config();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1800 * 1000,
      },
    })
  );

// Use the routes
require('./routes/index')(app);

// Basic route
app.get('/',(_,res)=>{
    res.send(`Hello From Express version: ${packageJson.dependencies.express}`);
});

module.exports = app;