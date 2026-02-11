require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/products');
const { connectDB } = require('./config/database');

// Using reliable Unsplash Source / IDs to prevent link rot
const products = [
    {
        name: "Eternal Rose Box",
        description: "A beautifully preserved real rose that lasts for a year. Encased in a crystal clear acrylic box with a drawer for jewelry or secret notes.",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1595159800539-7560d0325d7b?q=80&w=800&auto=format&fit=crop", // Roses
        category: "For Her",
        inStock: true
    },
    {
        name: "Luxury Spa Gift Set",
        description: "Indulge in relaxation with our premium spa set including bath bombs, essential oils, a plush towel, and scented candles. The perfect escape at home.",
        price: 85.00,
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop", // Spa
        category: "Relaxation",
        inStock: true
    },
    {
        name: "Personalized Leather Wallet",
        description: "Handcrafted full-grain leather wallet. Slim, durable, and elegant. Can be monogrammed with initials for a personal touch.",
        price: 60.00,
        image: "https://images.unsplash.com/photo-1627123424574-18bd75847587?q=80&w=800&auto=format&fit=crop", // Leather Wallet
        category: "For Him",
        inStock: true
    },
    {
        name: "Gourmet Chocolate Truffles",
        description: "A 24-piece collection of our finest artisanal chocolates. Flavors include dark chocolate raspberry, salted caramel, and hazelnut praline.",
        price: 35.50,
        image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=800&auto=format&fit=crop", // Chocolates
        category: "Food & Drink",
        inStock: true
    },
    {
        name: "Aromatherapy Diffuser",
        description: "Ultrasonic essential oil diffuser with color-changing LED lights. Quiet operation and elegant wood grain finish to match any decor.",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1602166242292-93a00e63e27c?q=80&w=800&auto=format&fit=crop", // Diffuser
        category: "Home",
        inStock: true
    },
    {
        name: "Minimalist Gold Necklace",
        description: "14k gold plated delicate chain with a small heart pendant. A subtle and timeless piece suitable for daily wear or special occasions.",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop", // Gold Necklace
        category: "Jewelry",
        inStock: true
    },
    {
        name: "Smart Coffee Mug",
        description: "Keep your coffee at the perfect temperature for hours. Controlled via smartphone app. Extended battery life and ceramic coating.",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop", // Coffee Mug
        category: "Tech",
        inStock: true
    },
    {
        name: "Custom Star Map",
        description: "A framed print showing the alignment of the stars on a specific date and location. A romantic gift to commemorate anniversaries or birthdays.",
        price: 55.00,
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop", // Starry Night / Map vibe
        category: "Decor",
        inStock: true
    },
    {
        name: "Vintage Style Mechanical Watch",
        description: "Classic design with a skeleton dial showing the inner workings. Leather strap and water-resistant. A statement piece for any gentleman.",
        price: 150.00,
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&auto=format&fit=crop", // Watch
        category: "Watches",
        inStock: true
    },
    {
        name: "Indoor Bonsai Tree",
        description: "A 5-year-old Juniper Bonsai tree. Comes in a ceramic pot with humidity tray. Brings peace and zen to any workspace or home.",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1512428813830-3e0e5d8e7093?q=80&w=800&auto=format&fit=crop", // Bonsai
        category: "Plants",
        inStock: true
    },
    {
        name: "Cashmere Scarf",
        description: "100% pure cashmere wool. Soft, warm, and luxurious. Available in neutral tones to complement any winter outfit.",
        price: 89.00,
        image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800&auto=format&fit=crop", // Scarf
        category: "Apparel",
        inStock: true
    },
    {
        name: "Craft Beer Brewing Kit",
        description: "Everything needed to brew 1 gallon of IPA at home. Includes glass fermenter, thermometer, tubing, and ingredients.",
        price: 49.95,
        image: "https://images.unsplash.com/photo-1627042698774-633d79361a9e?q=80&w=800&auto=format&fit=crop", // Beer
        category: "Hobbies",
        inStock: true
    },
    {
        name: "Silk Sleep Mask",
        description: "Pure mulberry silk sleep mask. Blocks out light completely while being gentle on skin and eyelashes. Includes travel pouch.",
        price: 25.00,
        image: "https://images.unsplash.com/photo-1558223694-bace890c9535?q=80&w=800&auto=format&fit=crop", // Sleep Mask (or close to it, cosmetic)
        category: "Wellness",
        inStock: true
    },
    {
        name: "Travel Jewelry Organizer",
        description: "Compact velvet case with compartments for rings, earrings, and necklaces. Prevents tangling and keeps jewelry safe during travel.",
        price: 22.00,
        image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=800&auto=format&fit=crop", // Jewelry Case
        category: "Travel",
        inStock: true
    },
    {
        name: "Succulent Terrarium Kit",
        description: "DIY kit to build your own geometric glass terrarium. Includes 3 succulents, soil, moss, and decorative stones.",
        price: 38.00,
        image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop", // Terrarium
        category: "Plants",
        inStock: true
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        await Product.deleteMany({}); // Clear existing products
        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
