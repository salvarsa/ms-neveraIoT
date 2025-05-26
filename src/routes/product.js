const express = require('express');
const productRouter = express.Router();
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/product.js');

productRouter.use(express.json());

productRouter.route('/').get(getAllProducts);
productRouter.route('/create').post(createProduct);
productRouter.route('/update').put(updateProduct);
productRouter.route('/delete').delete(deleteProduct);

module.exports = productRouter