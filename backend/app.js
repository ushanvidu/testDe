require('dotenv').config(); // Add this at the very top
const express = require('express');
const { connectDB } = require('./config/database');
const app = express();
const cors = require('cors');
const productRouter = require('./routes/productRoutes');

connectDB();


app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: ["http://34.228.254.199"],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', productRouter);
app.use('/api/cart', require('./routes/cartRoutes'));

app.get('/', (req, res) => res.send('Backend is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));