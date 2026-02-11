const Product=require('../models/products');
const logActivity=require('../utils/logger');


exports.getProduct=async (req, res)=>{
    try {
        const product= await Product.find();
        res.status(200).json(product);

    }catch(err){
        res.status(500).json({error : err.message});
    }
}

exports.addProduct=async (req, res)=>{
    try {
        const {user,productData}= req.body;
        if(user.role!=='admin'){
            return res.status(401).json({massage : 'Access Denied. Admins only.'});
        }
        const newProduct= await Product.create(productData);

        await logActivity(user, 'ADMIN_ADD_ITEM', {
            productName: newProduct.name,
            productId: newProduct._id
        });
        res.status(201).json({ message: "Product added", product: newProduct });
    }catch(err){
        res.status(500).json({error : err.message});
    }
};

exports.purchaseProduct=async (req, res)=>{
    try{
        const {user,productId,quantity}= req.body;
        const product= await Product.findById(productId);
        if(!product){
            return res.status(400).json({error : 'Product not found'});
        }
        await logActivity(user, 'USER_PURCHASE', {
            productName: product.name,
            price: product.price,
            quantity: quantity || 1
        });
        res.status(205).json({massage: 'Product purchased successfully'});

    }
    catch(err){
        res.status(500).json({error : err.message});
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { user, productId } = req.body;

        // 1. Security Check
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied. Admins only.' });
        }

        // 2. Find product FIRST to verify it exists and get details for the log
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // 3. Delete the product
        await Product.findByIdAndDelete(productId);

        // 4. Log the activity (Now safe because we have the 'product' variable)
        await logActivity(user, 'ADMIN_DELETE_ITEM', {
            productName: product.name,
            productId: product._id,
            price: product.price
        });

        res.status(200).json({ message: 'Product deleted successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        // We expect 'updates' to be an object like { price: 200, name: "New Name" }
        const { user, productId, updates } = req.body;

        // 1. Security Check
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied. Admins only.' });
        }

        // 2. Find and Update
        // { new: true } tells Mongoose to return the *updated* document, not the old one
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // 3. Log the activity
        await logActivity(user, 'ADMIN_UPDATE_ITEM', {
            productName: updatedProduct.name,
            productId: updatedProduct._id,
            changes: updates // Logs exactly what changed (Good for DevOps auditing)
        });

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};