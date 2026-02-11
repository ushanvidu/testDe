const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addToCart);
router.post('/list', cartController.getCart); // Using POST to easily send user object in body as per current app pattern
router.post('/remove', cartController.removeFromCart);
router.post('/checkout', cartController.checkout);

module.exports = router;
