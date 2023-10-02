const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// Create GET route to get all products
// http://localhost:3001/api/products
router.get('/', async (req, res) => {
  // Find all products and include associated Category and Tag data
  try {
    const productData = await Product.findAll({
      // Include (join) the category and tag models
      include: [{ model: Category }, { model: Tag }],
    });
    // Display success message
    res.status(200).json(productData);
  } catch (err) {
    // Display error message
    res.status(500).json(err);
  }
});

// Create GET route to get one product
// http://localhost:3001/api/products/{user input id}
router.get('/:id', async (req, res) => {
  // Find a single product by its `id`and include its associated Category and Tag data
  try {
    // Search for product with id matching user provided id
    const productData = await Product.findByPk(req.params.id, {
      // Include (join) the category and tag models
      include: [{ model: Category }, { model: Tag }],
    });

    // if no product exists with the user provided id
    if (!productData) {
      // Display 404 not found status code and message to the user
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }

    // Display success message
    res.status(200).json(productData);
  } catch (err) {
    // Display error message
    res.status(500).json(err);
  }
});

// Create POST route to create new product
// http://localhost:3001/api/products
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there are product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      // Display error message
      console.log(err);
      res.status(400).json(err);
    });
});

// Create PUT route to update product
// http://localhost:3001/api/products/{user input id}
router.put('/:id', async (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // Display error message
      res.status(400).json(err);
    });
});

// Create DELETE route to remove product
// http://localhost:3001/api/products/{user input id}
router.delete('/:id', async (req, res) => {
  // Delete one product by its `id` value
  try {
    // Find the product by the provided id and use destroy method
    const productData = await Product.destroy({
      // Delete product where id matches the provided id
      where: {
        id: req.params.id,
      },
    });

    // if no category exists with this id
    if (!productData) {
      // Display error message
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }
    
    // Display success message
    res.status(200).json(productData);
  } catch (err) {
    // Display error message
    res.status(500).json(err);
  }
});

// Export router
module.exports = router;
