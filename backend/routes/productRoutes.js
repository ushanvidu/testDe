const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/',productController.getProduct);
router.post('/add', productController.addProduct);
router.delete('/delete',productController.deleteProduct);
router.put('/update',productController.updateProduct);
router.post('/purchase',productController.purchaseProduct);

module.exports = router;