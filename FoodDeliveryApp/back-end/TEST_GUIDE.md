# FoodDeliveryApp Testing Guide

## Prerequisites
- Server running on `http://localhost:3000`
- MongoDB running
- Use Postman, curl, or any REST client

---

## Test Workflow

### Step 1: Create Admin User & Login

**1.1 Signup as Customer (first)**
```bash
POST http://localhost:3000/user/signup
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@foodapp.com",
  "password": "Admin@123",
  "phone": "555-0001",
  "addresses": [{
    "street": "100 Admin St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "label": "Work",
    "isDefault": true
  }]
}
```

**1.2 Manually Update User to Admin Role in MongoDB**
```bash
# In MongoDB shell or Compass:
db.users.updateOne(
  { email: "admin@foodapp.com" },
  { $set: { role: "admin" } }
)
```

**1.3 Login as Admin**
```bash
POST http://localhost:3000/user/login
Content-Type: application/json

{
  "email": "admin@foodapp.com",
  "password": "Admin@123"
}
```

**Response:** Save the `accessToken` for subsequent requests!

---

### Step 2: Create a Restaurant (Admin Only)

```bash
POST http://localhost:3000/restaurant/createrestaurantDetails
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "name": "Pizza Palace",
  "description":"",
  "phone": "555-1234",
  "email": "info@pizzapalace.com",
  "address": "123 Main St, New York, NY 10001",
  "operatingHours": {
    "monday": { "open": "09:00", "close": "22:00", "isClosed": false },
    "tuesday": { "open": "09:00", "close": "22:00", "isClosed": false },
    "wednesday": { "open": "09:00", "close": "22:00", "isClosed": false },
    "thursday": { "open": "09:00", "close": "22:00", "isClosed": false },
    "friday": { "open": "09:00", "close": "23:00", "isClosed": false },
    "saturday": { "open": "10:00", "close": "23:00", "isClosed": false },
    "sunday": { "open": "10:00", "close": "21:00", "isClosed": false }
  },
  "isOpen": true,
  "minimumOrder": 15,
  "deliveryFee": 5.00,
  "estimatedDeliveryTime": 30,
  "cuisine": ["Italian", "Pizza"]
}
```

**Response:** Save the restaurant `_id` (e.g., `64a123...`)

---

### Step 3: Add Menu Items to Restaurant

**3.1 Add Margherita Pizza**
```bash
POST http://localhost:3000/menuItems/addFoodItem
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "name": "Margherita Pizza",
  "description": "Fresh tomatoes, mozzarella, and basil",
  "price": 12.99,
  "category": "Pizza",
  "isAvailable": true,
  "restaurantId": "YOUR_RESTAURANT_ID"
}
```

**3.2 Add Pepperoni Pizza**
```bash
POST http://localhost:3000/menuItems/addFoodItem
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN

{
  "name": "Pepperoni Pizza",
  "description": "Classic pepperoni with cheese",
  "price": 14.99,
  "category": "Pizza",
  "isAvailable": true,
  "restaurantId": "YOUR_RESTAURANT_ID"
}
```

**3.3 Get All Menu Items from This Restaurant**
```bash
GET http://localhost:3000/menuItems?restaurantId=YOUR_RESTAURANT_ID
```

**Response:** Save the menu item `_id` values

---

### Step 4: Create Customer Account & Test Cart

**4.1 Signup as Customer**
```bash
POST http://localhost:3000/user/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Pass@123",
  "phone": "555-9999",
  "addresses": [{
    "street": "456 Oak Ave",
    "city": "Brooklyn",
    "state": "NY",
    "zipCode": "11201",
    "country": "USA",
    "label": "Home",
    "isDefault": true,
    "coordinates": {
      "latitude": 40.6782,
      "longitude": -73.9442
    }
  }]
}
```

**4.2 Login as Customer**
```bash
POST http://localhost:3000/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Pass@123"
}
```

**Response:** Save the customer's `accessToken`

---

### Step 5: Test Cart Functionality

**5.1 Add Margherita Pizza to Cart**
```bash
POST http://localhost:3000/cart/addToCart
Content-Type: application/json
Authorization: Bearer CUSTOMER_ACCESS_TOKEN

{
  "menuItemId": "MARGHERITA_PIZZA_ID",
  "quantity": 2
}
```

**5.2 Add Pepperoni Pizza to Cart**
```bash
POST http://localhost:3000/cart/addToCart
Content-Type: application/json
Authorization: Bearer CUSTOMER_ACCESS_TOKEN

{
  "menuItemId": "PEPPERONI_PIZZA_ID",
  "quantity": 1
}
```

**5.3 Get Cart**
```bash
GET http://localhost:3000/cart
Authorization: Bearer CUSTOMER_ACCESS_TOKEN
```

**Expected:** Cart shows 2 Margherita + 1 Pepperoni, total: $40.97

---

### Step 6: Test Single Restaurant Validation

**Create a second restaurant first (as admin), then try adding its items to cart.**

**Expected Error:**
```json
{
  "success": false,
  "message": "You can only order from one restaurant at a time. Current cart contains items from Pizza Palace. Please clear your cart first."
}
```

---

### Step 7: Place Order & Test Pricing Breakdown

```bash
POST http://localhost:3000/orders
Content-Type: application/json
Authorization: Bearer CUSTOMER_ACCESS_TOKEN

{
  "restaurantId": "YOUR_RESTAURANT_ID",
  "deliveryAddress": {
    "street": "456 Oak Ave",
    "city": "Brooklyn",
    "state": "NY",
    "zipCode": "11201",
    "country": "USA",
    "coordinates": {
      "latitude": 40.6782,
      "longitude": -73.9442
    }
  },
  "paymentMethod": "card"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "orderId": 1,
    "userId": "...",
    "restaurantId": "...",
    "items": [
      {
        "name": "Margherita Pizza",
        "price": 12.99,
        "quantity": 2
      },
      {
        "name": "Pepperoni Pizza",
        "price": 14.99,
        "quantity": 1
      }
    ],
    "pricing": {
      "subtotal": 40.97,
      "tax": 3.28,
      "deliveryFee": 5.00,
      "total": 49.25
    },
    "deliveryAddress": {
      "street": "456 Oak Ave",
      "city": "Brooklyn",
      "state": "NY",
      "zipCode": "11201",
      "country": "USA"
    },
    "status": "pending",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2025-11-02T...",
        "note": "Order created"
      }
    ],
    "paymentStatus": "pending",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Step 8: Test Order Status Updates (Admin/Restaurant Owner Only)

**8.1 Update Order Status**
```bash
PUT http://localhost:3000/orders/1/status
Content-Type: application/json
Authorization: Bearer ADMIN_ACCESS_TOKEN

{
  "status": "confirmed"
}
```

**8.2 Get Order to See Status History**
```bash
GET http://localhost:3000/orders/1
Authorization: Bearer CUSTOMER_ACCESS_TOKEN
```

**Expected:** `statusHistory` now has 2 entries (pending + confirmed)

---

## Test Cases Summary

### ✅ What to Verify:

1. **Restaurant Management**
   - [x] Admin can create restaurants
   - [x] Restaurants have operating hours
   - [x] Restaurants have deliveryFee and minimumOrder

2. **Menu Items**
   - [x] Menu items linked to specific restaurant
   - [x] Can filter menu items by restaurantId
   - [x] Populated restaurant details when fetching items

3. **Cart Validation**
   - [x] Can add items to cart
   - [x] Cannot mix items from different restaurants
   - [x] Clear error message about single restaurant rule

4. **Order Placement**
   - [x] Order requires structured delivery address (not just string)
   - [x] Automatic pricing breakdown (subtotal, tax, delivery, total)
   - [x] Validates minimum order amount
   - [x] Checks if restaurant is open
   - [x] Validates all items belong to specified restaurant

5. **Order Tracking**
   - [x] Status history automatically recorded
   - [x] Timestamps for each status change
   - [x] Initial "Order created" note

6. **User Addresses**
   - [x] Users can have multiple addresses
   - [x] Addresses have full structure (street, city, state, zip)
   - [x] Optional coordinates for delivery tracking

---

## Common Errors to Test

1. **Minimum Order Not Met:**
   - Cart total < $15.00
   - Expected: `"Minimum order amount is $15"`

2. **Restaurant Closed:**
   - Set `isOpen: false` on restaurant
   - Expected: `"Restaurant is currently closed"`

3. **Mixed Restaurant Items:**
   - Add item from Restaurant A, then Restaurant B
   - Expected: Single restaurant validation error

4. **Invalid Address:**
   - Missing required fields (street, city, state, zipCode)
   - Expected: Joi validation error

---

## Need Help?

- Check server logs: `tail -f /path/to/server/logs`
- MongoDB: Use MongoDB Compass to inspect data
- Rate limiting: If you get 429 errors, wait 15 minutes

**API Base URL:** `http://localhost:3000`
**MongoDB:** Running on default port 27017
