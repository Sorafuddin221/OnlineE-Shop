

import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../CartStyles/paymentSuccess.css';
import { Link, useSearchParams } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { removeErrors, removeSuccess} from '../features/order/orderSlice';
import { clearCart } from '../features/cart/cartSlice';
import axios from 'axios';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const paymentStatusFromUrl = searchParams.get('payment_status');
    const tranId = searchParams.get('tran_id');
    const method = searchParams.get('method');

    const [localPaymentStatus, setLocalPaymentStatus] = useState(
        paymentStatusFromUrl === 'success' ? 'validating' : paymentStatusFromUrl
    );
    const [orderId, setOrderId] = useState(null);

    const { loading, error, success } = useSelector(state => state.order);
    const dispatch = useDispatch();
    const intervalIdRef = useRef(null);

    // Polling function
    const pollPaymentStatus = useCallback(async (currentTranId) => {
        try {
            const { data } = await axios.get(`/api/v1/payment/sslcommerz/validate?tran_id=${currentTranId}`);
            setLocalPaymentStatus(data.paymentStatus);
            setOrderId(data.orderId);
            if (data.paymentStatus === 'succeeded') {
                toast.success('Payment Successful, Order Confirmed!', { position: 'top-center', autoClose: 3000 });
                dispatch(clearCart());
                sessionStorage.removeItem('orderItem');
                clearInterval(intervalIdRef.current); // Stop polling
            } else if (data.paymentStatus === 'failed' || data.paymentStatus === 'cancelled') {
                toast.error(`Payment ${data.paymentStatus}`, { position: 'top-center', autoClose: 3000 });
                sessionStorage.removeItem('orderItem');
                clearInterval(intervalIdRef.current); // Stop polling
            }
        } catch (err) {
            console.error('Polling error:', err);
            // Handle error, maybe stop polling after a few attempts
        }
    }, [dispatch]);

    useEffect(() => {
        if (method === 'cod') {
            setLocalPaymentStatus('succeeded');
            toast.success('Order Confirmed!', { position: 'top-center', autoClose: 3000 });
            dispatch(clearCart());
            sessionStorage.removeItem('orderItem');
        } else if (paymentStatusFromUrl === 'success' && tranId) {
            // Start polling if it's a success redirect
            intervalIdRef.current = setInterval(() => pollPaymentStatus(tranId), 3000); // Poll every 3 seconds
        } else if (paymentStatusFromUrl === 'fail' || paymentStatusFromUrl === 'cancel' || paymentStatusFromUrl === 'error') {
            setLocalPaymentStatus(paymentStatusFromUrl);
            toast.error(`Payment ${paymentStatusFromUrl}. Transaction ID: ${tranId}`, { position: 'top-center', autoClose: 3000 });
            sessionStorage.removeItem('orderItem');
        }

        return () => {
            clearInterval(intervalIdRef.current); // Clear interval on unmount
        };
    }, [dispatch, paymentStatusFromUrl, tranId, pollPaymentStatus, method]);

    useEffect(() => {
        if (success) {
            dispatch(removeSuccess());
        }
    }, [dispatch, success]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

  return (
    <>
    {loading?(<Loader/>):(<>
    <PageTitle title="Payment Status"/>
    <Navbar/>
    <div className="payment-success-container">
      <div className="success-content">
        <div className="success-icon">
            {localPaymentStatus === 'succeeded' && <div className="checkmart"></div>}
            {(localPaymentStatus === 'failed' || localPaymentStatus === 'cancelled' || localPaymentStatus === 'fail' || localPaymentStatus === 'cancel') && <div className="crossmark"></div>}
        </div>
        <h1>
            {localPaymentStatus === 'succeeded' ? 'Order Confirmed !' 
            : localPaymentStatus === 'validating' ? 'Validating Payment...' 
            : 'Payment Failed / Cancelled !'}
        </h1>
        <p>
            {method === 'cod' ? 'Your order has been placed successfully.' : `Your payment was ${localPaymentStatus}. Transaction ID : `}
            <strong>{tranId}</strong>
        </p>
            {orderId ? (
                 <Link className='explore-btn' to={`/order/${orderId}`}>view Order</Link>
            ) : (
                <Link className='explore-btn' to='/orders/user'>view All Orders</Link>
            )}
           
        </div>
    </div>
    <Footer/>
    </>)}
    </>
  )
}

export default PaymentSuccess