const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const userRoute = require('./routes/user.route');
const menuItemsRoute = require('./routes/menuItems.route');
const restaurantRoute = require('./routes/restaurant.route');
const cartRoute = require('./routes/cart.route');
const orderRoute = require('./routes/order.route');
const { generalLimiter } = require('./middleware/rateLimiter');
require('dotenv').config()

const app = express();

// 1. Security Headers (Helmet) - Must be first!
app.use(helmet());

// 2. CORS Configuration - Allow requests from your frontend
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:4000', // Your frontend URL
    credentials: true, // Allow cookies and authorization headers
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// 3. Rate Limiting - Protect against abuse
app.use(generalLimiter);

// 4. Body Parser
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('food delivery app is running');
});

app.use('/user', userRoute);
app.use('/menuItems', menuItemsRoute);
app.use('/restaurant', restaurantRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);

// Connect to database and start server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});