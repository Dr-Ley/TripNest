import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Explore from './components/Explore';
import About from './components/About';
import SignIn from './components/SignIn';
import HotelReservation from './components/HotelReservation';
import Restaurant from './components/Restaurant';
import Attraction from './components/Attraction';
import Cart from './components/Cart';
import PaymentPage from './components/Payment';
import OrderHistory from './components/OrderHistory';
import ChangePassword from './components/ChangePassword';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00aa6c',
      dark: '#008c5a',
      light: '#00cc7a',
    },
    secondary: {
      main: '#008c5a',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"DynaPuff", system-ui',
      fontWeight: 700,
      fontSize: '40px',
    },
    h2: {
      fontFamily: '"DynaPuff", system-ui',
      fontWeight: 600,
      fontSize: '28px',
    },
    h3: {
      fontFamily: '"DynaPuff", system-ui',
      fontWeight: 600,
      fontSize: '24px',
    },
    h4: {
      fontFamily: '"DynaPuff", system-ui',
      fontWeight: 600,
      fontSize: '20px',
    },
    h5: {
      fontWeight: 600,
      fontSize: '18px',
    },
    h6: {
      fontWeight: 600,
      fontSize: '16px',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.1)',
    '0 4px 24px rgba(0,0,0,0.07)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 4px 24px rgba(0,0,0,0.08)',
  ],
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/hotel-reservation" element={<HotelReservation />} />
                <Route path="/restaurant" element={<Restaurant />} />
                <Route path="/attraction" element={<Attraction />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/change-password" element={<ChangePassword />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
