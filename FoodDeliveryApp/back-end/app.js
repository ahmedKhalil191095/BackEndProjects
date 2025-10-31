const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user.route');
const menuItemsRoute = require('./routes/menuItems.route');
const resturantRoute = require('./routes/resturant.route');
const cartRoute = require('./routes/cart.route');
const orderRoute = require('./routes/order.route');
require('dotenv').config()

const app = express();
app.use(express.json());
const port = 3000;

app.get('/', (req, res) => {
    res.send('food delivery app is running');
});

app.use('/user', userRoute);
app.use('/menuItems', menuItemsRoute);
app.use('/resturant', resturantRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);

  mongoose
  .connect(
    "mongodb://127.0.0.1:27017/food-delivery-db"
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });