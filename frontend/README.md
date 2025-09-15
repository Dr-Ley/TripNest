#  **TripNest - Travel Booking Platform README**

##  **Project Overview**

**TripNest** is a comprehensive travel booking platform built with React and Node.js that allows users to discover, book, and manage travel experiences including hotels, restaurants, and attractions. The application features a modern, responsive design with full cart management, payment processing, and user account functionality.

---

##  **Key Features**

### **Booking & Shopping**
- **Multi-category booking** (Hotels, Restaurants, Attractions)
- **Shopping cart** with quantity management
- **Secure checkout** process with multiple payment options
- **Order history** tracking with detailed receipts

### **User Management**
- **User registration/login** with secure authentication
- **Password change** functionality with validation
- **Profile management** capabilities
- **Session management** with persistent login

### **Discovery & Search**
- **Advanced filtering** by location, price, rating, and category
- **Real-time search** across all offerings
- **Detailed listings** with images, descriptions, and amenities
- **Interactive maps** and location information

### **Responsive Design**
- **Mobile-first** responsive design
- **Touch-friendly** interfaces for mobile devices
- **Optimized layouts** for desktop, tablet, and mobile

---

## **Installation & Setup Guide**

### **Prerequisites**

- **Node.js** (v14.0.0 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

### **Installation Steps**

#### **1. Download the files**

#### **2. Install Dependencies**

**Backend Dependencies:**
```bash
cd backend
npm install
```

**Frontend Dependencies:**
```bash
cd frontend
npm install
```

#### **3. Environment Setup**

Create `.env` files in both frontend and backend directories:

**Backend `.env` (backend/.env):**
```bash
MONGODB_URI=mongodb://localhost:27017/tripnest
PORT=5000
JWT_SECRET=your-secret-key-here
```

**Frontend `.env` (frontend/.env):**
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

#### **4. Database Setup**

**Start MongoDB:**
```bash
# On macOS/Linux
mongod

# On Windows
# Open Command Prompt as Administrator
mongod
```

**Populate Database:**
```bash
cd backend
node populate-db.js
```

#### **5. Start the Application**

**Start Backend Server:**
```bash
cd backend
npm start
# Server will run on http://localhost:5000
```

**Start Frontend Development Server:**
```bash
cd frontend
npm start
# Application will open at http://localhost:3000
```

---

## **API Endpoints Documentation**

### **Authentication Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/logout` | User logout |
| `GET` | `/api/auth/me` | Get current user |

### **Products Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products?category=hotel` | Get hotels only |
| `GET` | `/api/products?category=restaurant` | Get restaurants only |
| `GET` | `/api/products?category=attraction` | Get attractions only |
| `GET` | `/api/products/:id` | Get single product |

### **Cart Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cart` | Get user's cart |
| `POST` | `/api/cart/add` | Add item to cart |
| `PUT` | `/api/cart/update/:id` | Update cart item |
| `DELETE` | `/api/cart/remove/:id` | Remove item from cart |

### **Booking Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bookings/my-bookings` | Get user bookings |
| `POST` | `/api/bookings/create` | Create new booking |
| `GET` | `/api/bookings/:id` | Get booking details |
| `PUT` | `/api/bookings/:id` | Update booking |

### **Hotels Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/hotels` | Get all hotels |
| `GET` | `/api/hotels/:id` | Get hotel details |
| `POST` | `/api/hotels/search` | Search hotels |

### **Restaurants Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/restaurants` | Get all restaurants |
| `GET` | `/api/restaurants/:id` | Get restaurant details |
| `POST` | `/api/restaurants/search` | Search restaurants |

### **Attractions Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/attractions` | Get all attractions |
| `GET` | `/api/attractions/:id` | Get attraction details |
| `POST` | `/api/attractions/search` | Search attractions |

### **Orders Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders/my-orders` | Get user orders |
| `POST` | `/api/orders/create` | Create new order |
| `GET` | `/api/orders/:id` | Get order details |

---

## **Database Structure**

### **MongoDB Collections**

#### **Users Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  phone: String,
  postCode: String,
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Products Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String, // 'hotel', 'restaurant', 'attraction'
  image: String,
  location: String,
  rating: Number,
  quantity: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Bookings Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  productId: ObjectId,
  bookingDate: Date,
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalPrice: Number,
  status: String,
  createdAt: Date
}
```

---

## **Local Development Access**

### **Local URLs**

- **Frontend Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **MongoDB**: `mongodb://localhost:27017/tripnest`

### **Demo User Accounts**

**Pre-populated test accounts:**
- **Email**: `bradleyouko911@gmail.com`
- **Password**: `misfit911`

**Registration**: New users can register directly through the signup form

---

## **Testing the Application**

### **Basic Testing Flow**

1. **Start the application** following the installation steps
2. **Navigate to** `http://localhost:3000`
3. **Register a new account** or use the demo account
4. **Browse hotels/restaurants/attractions**
5. **Add items to cart by booking**
6. **Proceed to checkout**
7. **View order history**

### **Feature Testing Checklist**

- [ ] User registration and login
- [ ] Browse and search products
- [ ] Add items to cart by booking
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Complete checkout process
- [ ] View order history
- [ ] Change password
- [ ] Responsive design on mobile

---

##  **Troubleshooting**

### **Common Issues**

#### **MongoDB Connection Issues**
```bash
# Ensure MongoDB is running
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

#### **Port Already in Use**
```bash
# Kill processes on port 3000 or 5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

#### **CORS Issues**
- Ensure backend server is running on port 5000
- Check frontend `.env` has correct API URL

#### **Missing Images**
- Run `npm run build` in frontend directory
- Ensure image files exist in `/public/images/`

---

## **Project Structure**

```
tripnest/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js
│   │   │   ├── HotelReservation.js
│   │   │   ├── Restaurant.js
│   │   │   ├── Attraction.js
│   │   │   ├── Cart.js
│   │   │   ├── Payment.js
│   │   │   ├── OrderHistory.js
│   │   │   ├── SignIn.js
│   │   │   ├── ChangePassword.js
│   │   │   └── About.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   └── App.js
│   ├── public/
│   └── package.json
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── populate-db.js
│   └── package.json
├── README.md
└── DATABASE_SCHEMAS.md
```
