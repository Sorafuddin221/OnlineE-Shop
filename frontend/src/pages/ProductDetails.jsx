import React, { useEffect, useState } from 'react';
import '../pageStyles/ProductDetails.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Rating from '@mui/material/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createReview, getProductDetails, removeErrors, removeSuccess } from '../features/products/productSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { removeMessage,addItemsToCart } from '../features/cart/cartSlice';

function ProductDetails() {
  const [userRating,setUserRating]=useState(0);
  const [comment,setComment]=useState('')
  const [quantity,setQuantity]=useState(1);
  const [selectedImage,setSelectedImage]=useState(null);

    
    const {loading,error,product,reviewSuccess,reviewLoading}=useSelector((state)=>state.product);
    const {loading:cartLoading,error:cartError,success,message,
      cartItems}=useSelector((state)=>state.cart);

    
    const dispatch=useDispatch();
    const {id}=useParams();
    useEffect(()=>{
      if(id){
      dispatch(getProductDetails(id));
      }
      return ()=>{
        dispatch(removeErrors())
      }
    },[dispatch,id])

       useEffect(()=>{
          if(error){
            toast.error(error.message,
            {position:'top-center',autoClose:3000});
            dispatch(removeErrors())
          }
          if(cartError){
            toast.error(cartError,
            {position:'top-center',autoClose:3000});    
          }
        },[dispatch,error,cartError])
        useEffect(()=>{
          if(success){
            toast.success(message,
            {position:'top-center',autoClose:3000});
            dispatch(removeMessage())
          }
          
        },[dispatch,success,message])
       
        const decreaseQuantity=()=>{
          if(quantity<=1){
            toast.error('Quantity cannot be less than 1',{position:'top-center',autoClose:3000})
            dispatch(removeErrors())
            return;
          }
          setQuantity(qty=>qty-1)
        }
        const increaseQuantity=()=>{
          if(product.stock<=quantity){
            toast.error('Cannot exceed available Stock!',{position:'top-center',autoClose:3000})
            dispatch(removeErrors())
            return;
          }
          setQuantity(qty=>qty+1)
        }
        const addToCart=()=>{
          dispatch(addItemsToCart({id,quantity}))
        }
      const handleReviewSubmit=(e)=>{
        e.preventDefault();
        if(!userRating){
          toast.error('Please select a Rating',{position:'top-center',autoClose:3000});
          return
        }
        dispatch(createReview({
          rating:userRating,
          comment,
          productId:id

        }))
      }
      useEffect(()=>{
        if(reviewSuccess){
          toast.success('Review Submitted Successfully',{position:'top-center',autoClose:3000});
          setUserRating(0);
          setComment("");
          dispatch(removeSuccess())
          dispatch(getProductDetails(id))
        }
      },[reviewSuccess,id,dispatch])
      useEffect(()=>{
        if(product && product.image && product.image.length>0){
          setSelectedImage(product.image[0].url)
        }
      },[product])

       if(loading){
          return(
            <>
            <Navbar/>
            <Loader/>
            <Footer/>
            </>
          )
        }
        if(error || !product){
          return (
            <>
            <PageTitle title="Product Details"/>
              <Navbar/>
              <Footer/>
              </>
          )
        }
        
  const discount = product.offeredPrice ? Math.round(((product.price - product.offeredPrice) / product.price) * 100) : null;

  return (
    <>
      <PageTitle title={`${product.name} -Details  `}/>
      <Navbar />
      <div className="product-details-container">
        <div className="product-detail-container">
          <div className="product-image-container">
            {discount && <div className="discount-badge">{discount}% off</div>}
            {selectedImage && <img src={selectedImage} alt={product.name} srcSet="" className='product-detail-image' />}
          {product.image.length>1 && (<div className="product-thumbnails">
            {product.image.map((img,index)=>(
              <img src={img.url} alt={`thumbnail ${index+1}`} key={index} className='thumbnail-image' onClick={()=>setSelectedImage(img.url)} />
            ))}
          </div>)}
          </div>
          <div className="product-info">
            <h2>{product.name}</h2>
            <p className='product-description'>{product.description}</p>
          <p className="product-category">Category: {product.category.name}</p>
          <p className="product-price">
            {product.offeredPrice ? (
              <>
                <span className="original-price">${product.price}</span>
                <span className="offered-price">${product.offeredPrice}</span>
              </>
            ) : (
              <strong>Price: ${product.price}</strong>
            )}
          </p>
          <div className="product-rating">
            <Rating 
            value={product.ratings}
            disabled={true}
            />
            <span className='productCardSpan'>
              ({product.numOfReviews} {product.numOfReviews===1?"Review":"Reviews"})
            </span>
          </div>
          <div className="stock-status">
            <span className={product.stock>1?`in stock`:'Out of Stock'}>
              {product.stock>0? `in stock (${product.stock} available)`:'Out of stock'} 
            </span>
          </div>
           {product.stock>0 && (<> <div className="quantity-controls">
              <span className="quantity-label">quantity</span>
              <button className="quantity-button" onClick={decreaseQuantity}>-</button>
              <input type="text" value={quantity} readOnly className="quantity-value" />
              <button onClick={increaseQuantity} className="quantity-button">+</button>
            </div>
            <button className="add-to-cart-btn" onClick={addToCart} disabled={cartLoading} >{cartLoading?'Adding':' Add to card'}</button>
        </>)}
          <form className="review-from" onSubmit={handleReviewSubmit}>
            <h3>Write a Review</h3>
            <Rating 
            value={userRating}
            onChange={(event, newValue) => {
              setUserRating(newValue);
            }}
            />
            <textarea required onChange={(e)=>setComment(e.target.value)} value={comment} className="review-input"></textarea>
            <button disabled={reviewLoading} className="submit-review-btn">{reviewLoading?'Submitting....':'Submit Review'}</button>
          </form>
          </div>
        </div>
        <div className="reviews-container">
          <h3>Customer Reviews</h3>
          {product.reviews && product.reviews.length>0? (<div className="reviews-section">
            {product.reviews.map((review,index)=>(
              <div className="review-item" key={index}>
              <div className="review-header">
                <Rating value={review.rating} disabled={true}/>
              </div>
              <p className="review-comment">
                {review.comment}
              </p>
              <p className="review-name">
                By : {review.name}
              </p>
            </div>))}
          </div>):(
            <p className="no-reviews">
              No reviews yes.Be the first to review this product!
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetails;
