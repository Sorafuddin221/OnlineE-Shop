import React, { useEffect } from 'react';
import Home from './pages/Home';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Register from './User/Register';
import ProductDetails from './pages/ProductDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './User/Login';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './features/user/userSlice';
import { clearCart } from './features/cart/cartSlice'; // Import clearCart
import UserDashboard from './User/UserDashboard';
import Profile from './User/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import UpdateProfile from './User/UpdateProfile';
import UpdatePassword from './User/UpdatePassword';
import ForgotPassword from './User/ForgotPassword';
import ResetPassword from './User/ResetPassword';
import Cart from './Cart/Cart';
import Shipping from './Cart/Shipping';
import OrderConfirm from './Cart/OrderConfirm';
import Payment from './Cart/Payment';
import PaymentSuccess from './Cart/paymentSuccess';
import MyOrders from './Orders/MyOrders';
import OrderDetails from './Orders/OrderDetails';
import Dashboard from './Admin/Dashboard';
import ProductsList from './Admin/ProductsList';
import CreateProduct from './Admin/CreateProduct';
import UpdateProduct from './Admin/UpdateProduct';
import UsersList from './Admin/UsersList';
import UpdateRole from './Admin/UpdateRole';
import OrdersList from './Admin/OrdersList';
import UpdateOrder from './Admin/UpdateOrder';
import ReviewsList from './Admin/ReviewsList';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';




function App() {
  const {isAuthenticated,user}=useSelector(state=>state.user);
  const dispatch=useDispatch()
  useEffect(()=>{
    if(isAuthenticated){
      dispatch(loadUser())
        .unwrap() // Use unwrap to handle fulfilled/rejected states
        .catch((error) => {
          if (error.statusCode === 401) { // Check for 401 Unauthorized status
            dispatch(clearCart()); // Clear cart if user session is invalid
          }
        });
    }
    
  },[dispatch, isAuthenticated]) // Added isAuthenticated to dependency array
  console.log(isAuthenticated,user);
  return (
    <Router>
      <ToastContainer autoClose={3000} theme="colored" />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="product/:id" element={<ProductDetails/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/products/:keyword" element={<Products/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/password/forgot" element={<ForgotPassword/>}/>
        <Route path="/reset/:token" element={<ResetPassword/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/shipping" element={<ProtectedRoute element={<Shipping/>}/>}/>
        <Route path="/order/confirm" element={<ProtectedRoute element={<OrderConfirm/>}/>}/>
        <Route path="/process/payment" element={<ProtectedRoute element={<Payment/>}/>}/>
        <Route path="/paymentSuccess" element={<ProtectedRoute element={<PaymentSuccess/>}/>}/>
        <Route path="/Orders/user" element={<ProtectedRoute element={<MyOrders/>}/>}/>
        <Route path="/Order/:orderId" element={<ProtectedRoute element={<OrderDetails/>}/>}/>
        {/*admin route*/}
        <Route path="/admin/dashboard" element={<ProtectedRoute element={<Dashboard/>} adminOnly={true}/>}/>
        <Route path="/admin/products" element={<ProtectedRoute element={<ProductsList/>} adminOnly={true}/>}/>
        <Route path="/admin/product/create" element={<ProtectedRoute element={<CreateProduct/>} adminOnly={true}/>}/>
        <Route path="/admin/product/:updateId" element={<ProtectedRoute element={<UpdateProduct/>} adminOnly={true}/>}/>
        <Route path="/admin/users" element={<ProtectedRoute element={<UsersList/>} adminOnly={true}/>}/>
        <Route path="/admin/user/:userId" element={<ProtectedRoute element={<UpdateRole/>} adminOnly={true}/>}/>
        <Route path="/admin/orders" element={<ProtectedRoute element={<OrdersList/>} adminOnly={true}/>}/>
        <Route path="/admin/order/:orderId" element={<ProtectedRoute element={<UpdateOrder/>} adminOnly={true}/>}/>
        <Route path="/admin/reviews" element={<ProtectedRoute element={<ReviewsList/>} adminOnly={true}/>}/>

        <Route path="/profile" element={<ProtectedRoute element={<Profile/>}/>}/>
        <Route path="/profile/update" element={<ProtectedRoute element={<UpdateProfile/>}/>}/>
        <Route path="/password/update" element={<ProtectedRoute element={<UpdatePassword/>}/>}/>



        <Route path="/about-us" element={<AboutUs/>}/>
        <Route path="/contact" element={<ContactUs/>}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
        <Route path="/terms-and-conditions" element={<TermsAndConditions/>}/>
      </Routes>
      {isAuthenticated && <UserDashboard user={user}/>}
    </Router>
  )
}

export default App