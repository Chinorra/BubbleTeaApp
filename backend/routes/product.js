const express = require('express');
const { productController } = require('../controllers');

const productRouter = express.Router()

productRouter.get('/', productController.queryProducts)
productRouter.post('/', productController.createProduct)
productRouter.patch('/', productController.updateProduct)
productRouter.delete('/', productController.deleteProduct)

module.exports = productRouter;