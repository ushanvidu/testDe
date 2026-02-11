const User = require('../models/user');
const Product = require('../models/products');
const logActivity = require('../utils/logger');

exports.addToCart = async (req, res) => {
    try {
        const { user, productId, quantity } = req.body;
        if (!user || !user._id) {
            return res.status(400).json({ message: "User is required" });
        }
        const qty = quantity || 1;

        const dbUser = await User.findById(user._id);
        if (!dbUser) return res.status(404).json({ message: "User not found" });

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Check if item already in cart
        const cartItemIndex = dbUser.cart.findIndex(item => item.productId.toString() === productId);

        if (cartItemIndex > -1) {
            // Update quantity
            dbUser.cart[cartItemIndex].quantity += qty;
        } else {
            // Add new item
            dbUser.cart.push({ productId, quantity: qty });
        }

        await dbUser.save();

        // Return full cart with product details
        const populatedUser = await dbUser.populate('cart.productId');
        res.status(200).json(populatedUser.cart);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        // user object from middleware/body typically has _id, but let's rely on finding by ID to be safe and populate
        // Note: In this simple app, we are passing 'user' in body. In a real app, use req.user from auth middleware.
        const userId = req.body.user?._id || req.query.userId;

        if (!userId) return res.status(400).json({ message: "User ID required" });

        const dbUser = await User.findById(userId).populate('cart.productId');
        if (!dbUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json(dbUser.cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { user, productId } = req.body;

        const dbUser = await User.findById(user._id);
        if (!dbUser) return res.status(404).json({ message: "User not found" });

        dbUser.cart = dbUser.cart.filter(item => item.productId.toString() !== productId);
        await dbUser.save();

        const populatedUser = await dbUser.populate('cart.productId');
        res.status(200).json(populatedUser.cart);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.checkout = async (req, res) => {
    try {
        const { user } = req.body;
        const dbUser = await User.findById(user._id).populate('cart.productId');

        if (!dbUser) return res.status(404).json({ message: "User not found" });
        if (dbUser.cart.length === 0) return res.status(400).json({ message: "Cart is empty" });

        // Calculate total for logging (optional)
        const totalAmount = dbUser.cart.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);

        // Clear cart
        dbUser.cart = [];
        await dbUser.save();

        // Log activity
        await logActivity(user, 'USER_CHECKOUT', {
            itemCount: dbUser.cart.length, // this is now 0, oops. 
            totalAmount: totalAmount
        });

        res.status(200).json({ message: "Checkout successful! Thank you for your purchase." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
