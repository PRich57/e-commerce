const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    // Create a new category with the provided input from the user (req.body)
    const categoryData = await Category.create(req.body);
    // Display success message
    res.status(200).json(categoryData);
  } catch (err) {
    // Throw 400 error code for improper usage and server cannot or will not respond
    res.status(400).json(err);
  }
});

// Create route to update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // if no category exists with this id
    if (!categoryData) {
      // send a 404 not found status and display the message to the user
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }
  } catch (err) {
    // Throw 500 error status if the above attempt encounters a server error
    res.status(500).json(err);
  }
});

// Create delete route to remove a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    // Find the category by the provided id and use destroy method
    const categoryData = await Category.destroy({
      // Delete category where id matches the provided id
      where: {
        id: req.params.id,
      },
    });

    // if no category exists with this id
    if (!categoryData) {
      // Send 404 not found response and display the message to the user
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

  } catch (err) {
    // Throw 500 error status if the above attempt encounters a server error
    res.status(500).json(err);
  }
});

// Export router
module.exports = router;
