// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
//import ProductDetail from './pages/Products/ProductDetail';
import Cart from './pages/Cart/Cart';
//import Checkout from './pages/Checkout/Checkout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/User/Profile';
//import Orders from './pages/User/Orders';
//import OrderDetails from './pages/User/OrderDetails';
//import Wishlist from './pages/User/Wishlist';
//import AdminDashboard from './pages/Admin/Dashboard';
//import AdminProducts from './pages/Admin/Products/AdminProducts';
import AddProduct from './pages/Admin/Products/AddProduct';
//import EditProduct from './pages/Admin/Products/EditProduct';
//import AdminOrders from './pages/Admin/Orders/AdminOrders';
//import AdminUsers from './pages/Admin/Users/AdminUsers';
//import Analytics from './pages/Admin/Analytics/Analytics';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import Loading from './pages/Shared/Loading';
//import Error from './pages/Shared/Error';
//import NotFound from './pages/Shared/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                {/*<Route path="/products/:id" element={<ProductDetail />} />*/}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/loading" element={<Loading />} />
                {/*<Route path="/error" element={<Error />} />*/}

                {/* Protected User Routes 
              <Route path="/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
              {/*<Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
               */}

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                  {/*
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/orders/:orderId" element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                } />
                 */}

                {/* Admin Routes */}
                {/*<Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/admin/products" element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                } />
                <Route path="/admin/products/add" element={
                  <AdminRoute>
                    <AddProduct />
                  </AdminRoute>
                } />
                <Route path="/admin/products/edit/:id" element={
                  <AdminRoute>
                    <EditProduct />
                  </AdminRoute>
                } />
                <Route path="/admin/orders" element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                } />
                <Route path="/admin/analytics" element={
                  <AdminRoute>
                    <Analytics />
                  </AdminRoute>
                } />*/}

                
                {/* 404 Route */}
                {/* <Route path="*" element={<NotFound />} /> */}
                  

              </Routes>
              
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: 'green',
                    secondary: 'black',
                  },
                },
              }}
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;