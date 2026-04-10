import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import '../pageStyles/Products.css'
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, removeErrors } from '../features/products/productSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllCategories } from '../features/category/categorySlice';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import NoProducts from '../components/NoProducts';
import Product from '../components/Product';
import Pagination from '../components/Pagination';



function Products() {
  const {loading,error,products,resultsPerpage,productCount}
  =useSelector(state=>state.product);
  const {categories, loading:categoryLoading, error:categoryError} = useSelector(state=>state.category);
  const dispatch=useDispatch();
  const location=useLocation();
  const searchParams= new URLSearchParams(location.search);
  const keyword=searchParams.get("keyword")
  const category=searchParams.get("category")

  const pageFromURL=parseInt(searchParams.get("page"),10) || 1
  const [currentPage,setCurrentPage]=useState(pageFromURL);
  const navigate=useNavigate();
  useEffect(()=>{
      dispatch(getProduct({keyword,page:currentPage,category}))
      dispatch(getAllCategories());
    },[dispatch,keyword,currentPage,category])
    useEffect(()=>{
        if(error){
          toast.error(error.message,
          {position:'top-center',autoClose:3000});
          dispatch(removeErrors())
        }
      },[dispatch,error])
      const handlePageChange=(page)=>{
        if(page!==currentPage){
          setCurrentPage(page);
          const newSearchParams=new URLSearchParams(location.search);
          if(page===1){
            newSearchParams.delete('page')
          }else{
            newSearchParams.set('page',page)
          }
          navigate(`?${newSearchParams.toString()}`)
        }
      }
      const handleCategoryClick=(category)=>{
        const newSearchParams=new URLSearchParams(location.search);
        newSearchParams.set('category',category)
        newSearchParams.delete('page')
        navigate(`?${newSearchParams.toString()}`)
      }
  return (
    <>
    { loading?(<Loader/>):(<>
      <PageTitle title="All Products" />
      <Navbar />
      <div className='products-layout'>
        <div className="filter-section">
            <h3 className="filter-header">
              Categories
            </h3>
            {/*Render Categories*/}
            <ul>
              {
                categories && categories.map((cat) => {
                  return (
                    <li key={cat._id} onClick={() => handleCategoryClick(cat.name)}>
                      {cat.name}
                    </li>
                  );
                })
              }
            </ul>
        </div>
        <div className="products-section">
          {products.length>0?( <div className="products-product-container">
          {products.map((product)=>(
            <Product key={product._id} product={product}/>
          ))}
          </div>):(
            <NoProducts keyword={keyword}/>
          )}
          <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          />
        </div>
      </div>
      <Footer />
    </>)}
    </>
  )
}

export default Products;
