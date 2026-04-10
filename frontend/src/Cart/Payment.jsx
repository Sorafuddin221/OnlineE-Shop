import React, { useState } from 'react';
import '../CartStyles/Payment.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutPath from './CheckoutPath';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function Payment() {
    const orderItem = JSON.parse(sessionStorage.getItem('orderItem'));
    const { cartItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const completePayment = async (amount) => {
        try {
            const orderId = orderItem._id;

            if (paymentMethod === 'cod') {
                // For Cash on Delivery, update the order status and redirect to success page
                const { data } = await axios.put(`/api/v1/order/${orderId}`, {
                    paymentStatus: 'pending',
                    orderStatus: 'processing',
                });
                if (data.success) {
                    navigate('/paymentSuccess?method=cod');
                } else {
                    toast.error('Failed to update order for COD. Please try again.', { position: 'top-center', autoClose: 3000 });
                }
            } else {
                // For other payment methods, proceed with SSLCOMMERZ
                const { data } = await axios.post('/api/v1/payment/sslcommerz/init', {
                    amount: amount,
                    orderId: orderId,
                });

                if (data.success && data.url) {
                    window.location.replace(data.url);
                } else {
                    toast.error('SSLCOMMERZ initiation failed. Please try again.', { position: 'top-center', autoClose: 3000 });
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message, { position: 'top-center', autoClose: 3000 });
        }
    };

    return (
        <>
            <PageTitle title="Payment Processing " />
            <Navbar />
            <CheckoutPath activePath={2} />
        <div className="payment-container">
            <div className="payment-methods">
                    <h3>Select Payment Method</h3>
                    <div>
                        <input 
                            type="radio" 
                            id="cod" 
                            name="paymentMethod" 
                            value="cod" 
                            checked={paymentMethod === 'cod'} 
                            onChange={() => setPaymentMethod('cod')} 
                        />
                        <label htmlFor="cod">Cash on Delivery</label>
                    </div>
                    {/* <div>
                        <input 
                            type="radio" 
                            id="mobile" 
                            name="paymentMethod" 
                            value="mobile" 
                            checked={paymentMethod === 'mobile'} 
                            onChange={() => setPaymentMethod('mobile')} 
                        />
                        <label htmlFor="mobile">Mobile Payment</label>
                    </div>
                    <div>
                        <input 
                            type="radio" 
                            id="card" 
                            name="paymentMethod" 
                            value="card" 
                            checked={paymentMethod === 'card'} 
                            onChange={() => setPaymentMethod('card')} 
                        />
                        <label htmlFor="card">Card Payment</label>
                    </div> */}
                </div>
            <div/>
            </div>
            <div className="payment-container">
                <Link to={"/order/confirm"} className='payment-go-back'>Go Back</Link>
                
                <button className="payment-btn" onClick={() => completePayment(orderItem.totalPrice)}>
                    {paymentMethod === 'cod' ? 'Confirm Order' : `Pay (${orderItem.totalPrice})/-`}
                </button>
            </div>
            <Footer />
        </>
    );
}

export default Payment;