const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');

// Load environment variables from .env file if it exists
if (fs.existsSync(path.join(__dirname, '.env'))) {
  require('dotenv').config();
} else {
  console.warn('.env file not found, proceeding without loading environment variables');
}

const indexRouter = require('./routes/index');
const books = require('./routes/books');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', books);

module.exports = app;
