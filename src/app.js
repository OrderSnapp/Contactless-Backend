const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const packageJson = require('../package.json');

// const corsOptions = {
//     origin: 'http://example.com', // Allow only this origin
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these methods
//     credentials: true, // Allow credentials
//     optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 204
// };
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// app.use(cors(corsOptions));
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Use the routes
require('./routes/index')(app);

// Basic route
app.get('/',(_,res)=>{
    res.send(`Hello From Express version: ${packageJson.dependencies.express}`);
});

module.exports = app;