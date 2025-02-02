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
const booksRouter = require('./routes/books');
const categoriesRouter = require('./routes/categories');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/categories', categoriesRouter);

module.exports = app;
