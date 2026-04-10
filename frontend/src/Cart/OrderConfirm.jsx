import React from 'react'
import '../CartStyles/OrderConfirm.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import CheckoutPath from './CheckoutPath'

import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { createOrder } from '../features/order/orderSlice'


function OrderConfirm() {
  const {shippingInfo,cartItems}=useSelector(state=>state.cart);
  const {user}=useSelector(state=>state.user)
  const subtotal=cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0)
    {/*tax 18%*/}
    const tax=subtotal*0
    const shippingCharges = shippingInfo.shippingMethod === 'inside' ? 80 : 120;
    const total=subtotal+tax+shippingCharges;
    const navigate=useNavigate()
    const dispatch=useDispatch()

    const proceedToPayment = async () => {
        const orderData = {
            shippingInfo: {
                ...shippingInfo,
                Country: shippingInfo.country,
                phoneNo: shippingInfo.phoneNumber,
                shippingMethod: shippingInfo.shippingMethod,
            },
            orderItems: cartItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                Image: item.image, // Corrected to Image to match backend model
                product: item.product,
            })),
            itemPrice: subtotal,
            taxPrice: tax,
            shippingPrice: shippingCharges,
            totalPrice: total,
        };

        try {
            // Dispatch the createOrder thunk
            const resultAction = await dispatch(createOrder(orderData));
            if (createOrder.fulfilled.match(resultAction)) {
                sessionStorage.setItem('orderItem', JSON.stringify(resultAction.payload.order));
                navigate('/process/payment');
            } else {
                // Handle error if createOrder was rejected
                toast.error(resultAction.payload?.message || 'Order creation failed', {
                    position: 'top-center',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Failed to create order:", error);
            toast.error('Something went wrong during order creation', {
                position: 'top-center',
                autoClose: 3000,
            });
        }
    };

  return (
    <>
    <PageTitle title="Order Confirm"/>
    <Navbar/>
    <CheckoutPath activePath={1}/>
      <div className="confirm-container">
        <h2 className="confirm-header">Order Confirm</h2>
          <div className="confirm-table-container">
            <table className="confirm-table">
              <caption>Shipping Details</caption>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{user.name}</td>
                  <td>{shippingInfo.phoneNumber}</td>
                  <td>{shippingInfo.address},{shippingInfo.city},{shippingInfo.state}
                    {shippingInfo.country},{shippingInfo.pinCode}
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="confirm-table cart-table">
              <caption>Cart Item</caption>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
                </thead>
                <tbody>
                  {cartItems.map((item)=>(
                    <tr key={item.product}>
                    <td><img src={item.image} alt={item.name} className='product-image' /></td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>{item.quantity*item.price}</td>
                  </tr>
                  ))}
                </tbody>
              
            </table>
            <table className="confirm-table">
              <caption>Order Summary</caption>
              <thead>
                <tr>
                  <th>Subtotal</th>
                  <th>Shipping Charge</th>
                  <th>Tax</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{subtotal}/-</td>
                  <td>{shippingCharges}/-</td>
                  <td>{tax}/-</td>
                  <td>{total}/-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="proceed-button" onClick={proceedToPayment}>Proceed to Payment</button>
      </div>
     <Footer/>
    </>
  )
}

export default OrderConfirm