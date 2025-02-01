const router = require('express').Router();

/* GET home page. */
router.get('/', function(_req, res, _next) {
  res.json({ title: 'isbn-to-markdown-api' });
});

module.exports = router;
