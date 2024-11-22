const express = require('express');
const app = express();
const routes = require('./routes/index');


// Middleware to parse JSON
app.use(express.json());

// Use the routes
require('./routes/index')(app);

// Basic route
app.get('/',(_,res)=>{
    res.send('Hello World');
});

module.exports = app;