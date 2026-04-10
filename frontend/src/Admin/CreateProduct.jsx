import React, { useEffect, useState } from 'react'
import '../AdminStyles/CreateProduct.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct, removeErrors, removeSuccess } from '../features/admin/adminSlice'
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../features/category/categorySlice';
import { toast } from 'react-toastify'
import { Editor } from '@tinymce/tinymce-react';

function CreateProduct() {
    const {success,loading,error}=useSelector(state=>state.admin);
    const {categories, loading:categoryLoading, error:categoryError} = useSelector(state=>state.category);
    const dispatch=useDispatch();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [offeredPrice, setOfferedPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editedCategoryName, setEditedCategoryName] = useState("");
    const [newCategoryImage, setNewCategoryImage] = useState("");
    const [newCategoryImagePreview, setNewCategoryImagePreview] = useState("");
    const [editingCategoryImage, setEditingCategoryImage] = useState("");
    const [editingCategoryImagePreview, setEditingCategoryImagePreview] = useState("");

    const handleAddCategory = () => {
        if (newCategory.trim() !== "" && newCategoryImage !== "") {
            dispatch(createCategory({ name: newCategory, image: newCategoryImage }));
            setNewCategory("");
            setNewCategoryImage("");
            setNewCategoryImagePreview("");
        }
    };

    const handleEditCategory = (id, name, image) => {
        setEditingCategory(id);
        setEditedCategoryName(name);
        setEditingCategoryImagePreview(image && image.length > 0 ? image[0].url : "");
        setEditingCategoryImage(image && image.length > 0 ? image[0].url : "");
    };

    const handleSaveEditedCategory = () => {
        if (editedCategoryName.trim() !== "") {
            dispatch(updateCategory({ id: editingCategory, categoryData: { name: editedCategoryName, image: editingCategoryImage } }));
            setEditingCategory(null);
            setEditedCategoryName("");
            setEditingCategoryImage("");
            setEditingCategoryImagePreview("");
        }
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setEditedCategoryName("");
        setEditingCategoryImage("");
        setEditingCategoryImagePreview("");
    };

    const handleDeleteCategory = (id) => {
        dispatch(deleteCategory(id));
    };


    useEffect(()=>{
        dispatch(getAllCategories());
    },[dispatch])




    
    const createProductSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('price', price);
        myForm.set('offeredPrice', offeredPrice);
        myForm.set('description', description);
        myForm.set('category', category);
        myForm.set('stock', stock);
        image.forEach((img) => {
            myForm.append("image", img)
        })
        dispatch(createProduct(myForm))

    }
    const createProductImage = (e) => {
        const files = Array.from(e.target.files);
        setImage([]);
        setImagePreview([]);
        files.forEach((file)=>{
             const reader=new FileReader();
             reader.onload=()=>{
                if(reader.readyState===2){
                    setImagePreview((old)=>[...old,reader.result]);
                    setImage((old)=>[...old,reader.result]);
                }
             }
             reader.readAsDataURL(file)
        })
    }
    useEffect(()=>{
        if(error){
            toast.error(error,{position:'top-center',autoClose:3000});
            dispatch(removeErrors())
        }if(success){
            toast.success("product Create successfully",{position:'top-center',autoClose:3000});
            dispatch(removeSuccess())
            setName("");
            setPrice("");
            setOfferedPrice("");
            setDescription("");
            setCategory("");
            setStock("");
            setImage([]);
            setImagePreview([]);

        }
    },[dispatch,error,success])
    return (
        <>
            <Navbar />
            <PageTitle title="Create Product" />
            <div className="create-product-container">
                <h1 className='form-title'> Create Product</h1>
                <form onSubmit={createProductSubmit} className='product-form' encType='multipart/form-data' action="">
                    <input value={name} onChange={(e) => setName(e.target.value)} name='name' type="text" className="form-input" placeholder='Enter Product Name' required />
                    <input value={price} onChange={(e) => setPrice(e.target.value)} name='Price' type="number" className="form-input" placeholder='Enter Product Price' required />
                    <input value={offeredPrice} onChange={(e) => setOfferedPrice(e.target.value)} name='offeredPrice' type="number" className="form-input" placeholder='Enter Offered Price' />
                    <Editor
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
                            toolbar:
                                'undo redo | formatselect | bold italic backcolor | \
                                alignleft aligncenter alignright alignjustify | \
                                bullist numlist outdent indent | removeformat | help'
                        }}
                        onEditorChange={(newValue, editor) => setDescription(newValue)}
                        value={description}
                    />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} name='category' id="" className="form-select">
                        <option value="" required >Choose a Category</option>
                        {categories && categories.map((item) => (
                            <option key={item._id} value={item._id}>{item.name}</option>
                        ))}

                    </select>
                    <input value={stock} onChange={(e) => setStock(e.target.value)} name='stock' type="text" className="form-input" placeholder='Enter Product Stock' required />
                    <div className="file-input-container">
                        <input onChange={createProductImage} name='image' type="file" className="form-input-file" accept='image/*' multiple />
                    </div>
                    <div className="image-preview-container">
                       { imagePreview.map((img,index)=>(
                            <img src={img} alt="Product Preview" className='image-preview' key={index} />
                       ))}
                    </div>
                    <button className="submit-btn">{loading?'Create Product...':'Create'}</button>
                </form>
                <div className="category-management-container">
                    <h1 className='form-title'>Manage Categories</h1>
                    <div className="add-category-form">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter new category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <div className="file-input-container">
                            <input
                                type="file"
                                className="form-input-file"
                                accept='image/*'
                                onChange={(e) => {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        if (reader.readyState === 2) {
                                            setNewCategoryImagePreview(reader.result);
                                            setNewCategoryImage(reader.result);
                                        }
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                }}
                            />
                        </div>
                        {newCategoryImagePreview && (
                            <img src={newCategoryImagePreview} alt="Category Preview" className="image-preview" />
                        )}
                        <button className="submit-btn" onClick={handleAddCategory}>Add Category</button>
                    </div>
                    <div className="category-list">
                        {categories && categories.map((categoryItem) => (
                            <div key={categoryItem._id} className="category-item">
                                {editingCategory === categoryItem._id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={editedCategoryName}
                                            onChange={(e) => setEditedCategoryName(e.target.value)}
                                        />
                                        <div className="file-input-container">
                                            <input
                                                type="file"
                                                className="form-input-file"
                                                accept='image/*'
                                                onChange={(e) => {
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        if (reader.readyState === 2) {
                                                            setEditingCategoryImagePreview(reader.result);
                                                            setEditingCategoryImage(reader.result);
                                                        }
                                                    };
                                                    reader.readAsDataURL(e.target.files[0]);
                                                }}
                                            />
                                        </div>
                                        {editingCategoryImagePreview && (
                                            <img src={editingCategoryImagePreview} alt="Category Preview" className="image-preview" />
                                        )}
                                        <div className="category-item-buttons">
                                            <button className="submit-btn" onClick={handleSaveEditedCategory}>Save</button>
                                            <button className="submit-btn" onClick={handleCancelEdit}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span>{categoryItem.name}</span>
                                        {categoryItem.image && categoryItem.image.length > 0 && (
                                            <img src={categoryItem.image[0].url} alt="Category" className="category-image-small" />
                                        )}
                                        <div className="category-item-buttons">
                                            <button className="submit-btn" onClick={() => handleEditCategory(categoryItem._id, categoryItem.name, categoryItem.image)}>Edit</button>
                                            <button className="submit-btn" onClick={() => handleDeleteCategory(categoryItem._id)}>Delete</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />

        </>
    )
}

export default CreateProduct