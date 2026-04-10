import React, { useEffect, useState } from 'react';
import '../AdminStyles/UpdateOrder.css'
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../features/order/orderSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { removeErrors, removeSuccess, updateOrderStatus } from '../features/admin/adminSlice';

function UpdateOrder() {
    const [status,setStatus]=useState("")
    const {orderId}=useParams();
    const {order,loading:orderLoading}=useSelector(state=>state.order);
    const {success,loading:adminLoading,error}=useSelector(state=>state.admin);
    const loading=orderLoading || adminLoading
    
    const dispatch=useDispatch();
    useEffect(()=>{
        if(orderId){
            dispatch(getOrderDetails(orderId))
        }
        
    },[dispatch,orderId]);
    const {
        shippingInfo={},
        orderItems=[],
        paymentInfo={},
        orderStatus,
        totalPrice
    }=order
     const paymentStatus = paymentInfo.status === 'succeeded' ? 'Paid' : (paymentInfo.status || 'Not Paid');
     const finalOrderStatus=orderStatus;
     const handleStatusUpdate=()=>{
        if(!status){
            toast.error('please select a status',{position:'top-center',autoClose:3000})
            return
        }
        dispatch(updateOrderStatus({orderId,status}))
     }
     useEffect(()=>{
         if(error){
           toast.error(error.message,
           {position:'top-center',autoClose:3000});
           dispatch(removeErrors())
         }
         if(success){
            toast.success("Order Status Updated Successfully",
           {position:'top-center',autoClose:3000});
           dispatch(removeSuccess());
           dispatch(getOrderDetails(orderId));
         }
       },[dispatch,error,success,orderId])
  return (
   <>
   <Navbar/>
   <PageTitle title="Upate Order"/>
        {loading?(<Loader/>):(<div className="order-container">
            <h1 className="order-title">Update Order</h1>
            <div className="order-details">
                <h2>order Information</h2>
                <p><strong>Order ID :</strong>{orderId}</p>
                <p><strong>Shipping Address :</strong>{shippingInfo.address},{shippingInfo.city},{shippingInfo.state}
                    {shippingInfo.Country},{shippingInfo.pinCode}</p>
                <p><strong>Phone :</strong>{shippingInfo.phoneNo}</p>
                <p><strong>Order Status :</strong>{finalOrderStatus}</p>
                <p><strong>Payment Status :</strong>{paymentStatus}</p>
                <p><strong>total Price :</strong>{totalPrice}</p>

            </div>
            <div className="order-items">
                <h2>Order Items</h2>
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.map((item)=>(
                        <tr key={item._id}>
                            <td>
                                <img src={item.Image} alt={item.name} className='order-item-image'/>
                            </td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}/-</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="order-status">
                <h2>Update Status</h2>
                <select disabled={loading || orderStatus==='Delivered' } name="" id="" className="status-select" value={status} onChange={(e)=>setStatus(e.target.value)}>
                    <option value="">Select Status</option>
                    <option value="Shipped">Shipped</option>
                    <option value="On The Way">On The Way</option>
                    <option value="Delivered">Delivered</option>
                </select>
                <button disabled={loading || !status || orderStatus==='Delivered' } onClick={handleStatusUpdate} className="update-button">Update Status</button>
            </div>
        </div>)}
   <Footer/>
   </>
  )
}

export default UpdateOrder