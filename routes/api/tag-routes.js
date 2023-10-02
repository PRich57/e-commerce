const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// http://localhost:3001/api/tags
router.get('/', async (req, res) => {
  // Find all tags and include its associated Product data
  try {
    const tagData = await Tag.findAll({
      // Include product model
      include: [{ model: Product }],
    });

    // Display success message
    res.status(200).json(tagData);
  } catch (err) {
    // Display error message
    res.status(500).json(err);
  }
});

// http://localhost:3001/api/tags/{user input id}
router.get('/:id', async (req, res) => {
  // Find a single tag by its `id` and include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    // if no tag exists with that id
    if (!tagData) {
      res.status(404).json({ message: 'No tag exists with that id!' });
      return;
    }

    // Display success message
    res.status(200).json(tagData);
  } catch (err) {
    // Display error message
    res.status(500).json(err);
  }
});

// http://localhost:3001/api/tags
router.post('/', async (req, res) => {
  // Create POST route to create a new tag
  try {
    // Create new tag with provided input from the user (req.body)
    const tagData = await Tag.create(req.body);
    // Display success message
    res.status(200).json(tagData);
  } catch (err) {
    //Display error message
    res.status(400).json(err);
  }
});

// http://localhost:3001/api/tags/{user input id}
router.put('/:id', async (req, res) => {
  // Create PUT route to update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // if no tag exists with this id
    if (!tagData) {
      // Send 404 not found status and display message to user
      res.status(404).json({ message: 'No tag exists with that id!' });
      return;
    }

    // Display success message
    res.status(200).json(tagData);
  } catch (err) {
    // Display error message
    res.status(500).json(err);
  }
});

// http://localhost:3001/api/tags/{user input id}
router.delete('/:id', async (req, res) => {
  // Create DELETE route to delete on tag by its `id` value
  try {
    // Find the tag by the provided id and use destroy method
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    // if no tag exists with this id
    if (!tagData) {
      // Send 404 not found response and display message to the user
      res.status(404).json({ message: 'No tag found with that id!'});
      return;
    }

    // Display success message
    res.status(200).json(tagData); 
  } catch (err) {
    //Display error message
    res.status(500).json(err);
  }
});

// Export router
module.exports = router;
