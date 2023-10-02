const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
// http://localhost:3001/api/tags
router.get('/', async (req, res) => {
  // Find all tags and include its associated Product data
  try {
    const tagData = await Tag.findAll({
      // ASK ABOUT HOW TO DO THIS THROUGH ASSOCIATION INSIDE THE INCLUDE. I THINK THIS IS RIGHT
      include: [{ model: Product, through: ProductTag }],
    });

    // Send success message
    res.status(200).json(tagData);
  } catch (err) {
    // Throw 500 status if there's a server error
    res.status(500).json(err);
  }
});

// http://localhost:3001/api/tags/{user input id}
router.get('/:id', async (req, res) => {
  // Find a single tag by its `id` and include its associated Product data
  try {
    const tagData = await Tag.findByPk(res.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });

    // if no tag exists with that id
    if (!tagData) {
      res.status(404).json({ message: 'No tag exists with that id!' });
      return;
    }

    // Send success message
    res.status(200).json(tagData);
  } catch (err) {
    // Throw 500 error code for server error
    res.status(500).json(err);
  }
});

// http://localhost:3001/api/tags
router.post('/', async (req, res) => {
  // Create POST route to create a new tag
  try {
    
  } catch (err) {
    
  }
});

// http://localhost:3001/api/tags/{user input id}
router.put('/:id', async (req, res) => {
  // Create PUT route to update a tag's name by its `id` value
  try {
    
  } catch (err) {
    
  }
});

// http://localhost:3001/api/tags/{user input id}
router.delete('/:id', async (req, res) => {
  // Create DELETE route to delete on tag by its `id` value
  try {
    
  } catch (err) {
    
  }
});

module.exports = router;
