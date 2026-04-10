
import React, { useState } from 'react'
import '../CartStyles/Cart.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartItem from './CartItem'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { saveShippingInfo } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'

function Cart() {
    const {cartItems, shippingInfo}=useSelector(state=>state.cart)
    const dispatch=useDispatch()
    const [shippingMethod, setShippingMethod] = useState(shippingInfo.shippingMethod || "inside");
    console.log(cartItems);
    const subtotal=cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0)
    {/*tax 18%*/}
    const tax=subtotal*0
    const shippingCharges = shippingMethod === "inside" ? 80 : 120;
    const total=subtotal+tax+shippingCharges;

    const navigate=useNavigate();
    const checkoutHandler=()=>{
        dispatch(saveShippingInfo({
            address: shippingInfo.address,
            pinCode: shippingInfo.pinCode,
            state: shippingInfo.state,
            city: shippingInfo.city,
            country: shippingInfo.country,
            phoneNumber: shippingInfo.phoneNumber,
            shippingMethod
        }))
        navigate('/shipping')
    }
  return (
    <>
 <Navbar/>
 <PageTitle title="Your Cart"/>
 {cartItems.length===0?(
    <div className="emply-cart-container">
        <p className="empty-cart-message">Your cart is Empty</p>
        <Link to="/products" className='viewproducts'>View Products</Link>
    </div>
 ): ( 
    
    <>
    
   
  
    <div className="cart-page">
        <div className="cart-items">
            <div className="cart-items-heading">Your Cart</div>
            <div className="cart-table">
                <div className="cart-table-header">
                    <div className="header-product">Product</div>
                    <div className="header-quantity">Quantity</div>
                    <div className="header-totalitem-total-heading">Item Total</div>
                    <div className="header-action">Actions</div>
                </div>
                {/* cart items*/}
                {cartItems && cartItems.map((item)=><CartItem item={item} key={item.name}/>)}
                
            </div>
        </div>
            <div className='shipping-page'>
                <div className=" shipping-summary">
                    <h3 className="price-summary-header">Shipping Method</h3>
                    <div className='shipping-item'>
                        <input
                            type="radio"
                            id="inside"
                            name="shippingMethod"
                            value="inside"
                            checked={shippingMethod === "inside"}
                            onChange={() => setShippingMethod("inside")}
                        />
                        <label htmlFor="inside">Inside Dhaka (80 Taka)</label>
                    </div>
                    <div className='shipping-item'>
                        <input
                            type="radio"
                            id="outside"
                            name="shippingMethod"
                            value="outside"
                            checked={shippingMethod === "outside"}
                            onChange={() => setShippingMethod("outside")}
                        />
                        <label htmlFor="outside">Outside Dhaka (120 Taka)</label>
                    </div>
                </div>
            </div>
                        {/* Price summary*/}`        
        <div className="price-summary">
            <h3 className="price-summary-header">Price Summary</h3>
            <div className="summary-item">
                <p className="summary-label">Subtotal</p>
                <p className="summary-label">{subtotal}/-</p>
            </div>
            <div className="summary-item">
                <p className="summary-label">tax(1)</p>
                <p className="summary-label">{tax}/-</p>
            </div>
            <div className="summary-item">
                <p className="summary-label">Shipping</p>
                <p className="summary-label">{shippingCharges}/-</p>
            </div>
            <div className="summary-total">
                <p className="total-label">Total Amount</p>
                <p className="total-value">{total}/-</p>
            </div>
            <button className="checkout-btn" onClick={checkoutHandler}>Proceed To CheckOut</button>

        </div>
    </div>
  
   </>)}
    <Footer/>
   </>
  )
}

export default Cart