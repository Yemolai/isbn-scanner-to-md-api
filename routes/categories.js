const router = require('express').Router();

function getCategoriesData() {
  try {
    return JSON.parse(process.env.CATEGORIES_DATA || '{}');
  } catch (error) {
    console.error('Error parsing CATEGORIES_DATA:', error);
    return {};
  }
}

router.get('/', (req, res) => {
  const categories = getCategoriesData();
  res.json(Object.keys(categories));
});

router.get('/:category/subcategories', (req, res) => {
  const { category } = req.params;
  const categories = getCategoriesData();
  
  if (!categories[category]) {
    return res.status(404).json({ error: 'Category not found' });
  }

  res.json(categories[category] || []);
});

module.exports = router;
