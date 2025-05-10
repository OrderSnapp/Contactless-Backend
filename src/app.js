const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const packageJson = require('../package.json');
require('dotenv').config();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// app.use(cors({
//   // origin: 'http://localhost:3000',
//   origin: ['http://localhost:3000', 'https://prod.sunchengchhay.me'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));
app.use(cors({
  origin: function (origin, callback) {
    const allowed = ['http://localhost:3000', 'https://prod.sunchengchhay.me'];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


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

require('./routes/index')(app);

app.get('/', (_, res) => {
  res.send(`Hello From Express version: ${packageJson.dependencies.express}`);
});

module.exports = app;