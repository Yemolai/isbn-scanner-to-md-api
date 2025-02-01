const express = require('express');
const router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(_req, res, _next) {
  res.json({ title: 'isbn-to-markdown-api' });
});

router.get('/scan', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/scan.html'));
});

module.exports = router;
