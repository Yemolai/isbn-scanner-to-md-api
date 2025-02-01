const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const fetch = require('node-fetch');

/* GET home page. */
router.get('/', function(_req, res, _next) {
  res.json({ title: 'isbn-to-markdown-api' });
});

router.get('/scan', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/scan.html'));
});

module.exports = router;
