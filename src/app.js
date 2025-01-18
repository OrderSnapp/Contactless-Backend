const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const packageJson = require('../package.json');

const corsOptions = {
    origin: 'localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Use the routes
require('./routes/index')(app);

// Basic route
app.get('/',(_,res)=>{
    res.send(`Hello From Express version: ${packageJson.dependencies.express}`);
});

module.exports = app;