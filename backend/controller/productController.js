import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js'; // Add this import
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import APIFunctionality from '../utils/apiFunctionality.js';
import { v2 as cloudinary } from 'cloudinary';
//creating products
export const creatProducts = handleAsyncError(async (req, res, next) => {
    let image = [];
    if (typeof req.body.image === "string") {
        image.push(req.body.image)
    } else {
        image = req.body.image
    }
    const imageLinks = [];
    for (let i = 0; i < image.length; i++) {
        const result = await cloudinary.uploader.upload(image[i], {
            folder: 'products'
        })
        imageLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    req.body.image = imageLinks
    req.body.user = req.user.id;
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})
//get all products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
    const resultsPerPage = 6;
    let queryStr = { ...req.query };

    if (req.query.category) {
        const categoryDoc = await Category.findOne({ name: req.query.category });
        if (categoryDoc) {
            queryStr.category = categoryDoc._id;
        } else {
            // If category not found, set to a non-existent ID to return no products for this category
            queryStr.category = '000000000000000000000000'; // Example of a non-existent ObjectId
        }
    }
    const apiFeatures = new APIFunctionality(Product.find(), queryStr).search()
        .filter()
        .sort('-createdAt');
    //getting filtered query befor pagination
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();

    //calculete totapage based on filtered count
    const totalPages = Math.ceil(productCount / resultsPerPage);
    const page = Number(req.query.page) || 1;

    if (page > totalPages && productCount > 0) {
        return next(new HandleError("this page desn't exist", 404))
    }
    //apply pagination
    apiFeatures.pagination(resultsPerPage);
    const products = await apiFeatures.query.populate('category');
    if (!products || products.length === 0) {
        return next(new HandleError("no Product Found", 404))
    }
    res.status(200).json({
        success: true,
        products,
        productCount,
        resultsPerPage,
        totalPages,
        currentpage: page
    })
})

//update product

export const updateProduct = handleAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new HandleError("product not Found", 404))

    }
    let images = [];
    if (typeof req.body.image === 'string') {
        images.push(req.body.image)
    } else if (Array.isArray(req.body.image)) {
        images = req.body.image
    }
    if (images.length > 0) {
        for (let i = 0; i < product.image.length; i++) {
            await cloudinary.uploader.destroy(product.image[i].public_id)
        }
        //upload new images
        const imageLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i], {
                folder: 'products'
            })
            imageLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.image = imageLinks
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })


    res.status(200).json({
        success: true,
        product
    })
})
//delete product
export const deleteProduct = handleAsyncError(async (req, res, next) => {

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return next(new HandleError("product not Found", 404))
    }
    for(let i=0;i<product.image.length;i++){
        await cloudinary.uploader.destroy(product.image[i].public_id)
    }
    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    })

})
// accessing single product

export const getSingleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
        return next(new HandleError("product not Found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
})
//creating and uppdating review
export const createReviewForProduct = handleAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);

    if (!product) {
        return next(new HandleError("product not found", 400))
    }

    const reviewExists = product.reviews.find(review => review.user.toString() === req.user.id.toString());
    if (reviewExists) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user.id.toString()) {
                review.rating = rating,
                    review.comment = comment
            }
        })
    } else {
        product.reviews.push(review)

    }
    product.numOfReviews = product.reviews.length
    let sum = 0;
    product.reviews.forEach(review => {
        sum += review.rating
    })
    product.ratings = sum / product.reviews.length > 0 ? sum / product.reviews.length : 0
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        product
    })
})

//getting reviews
export const getproductReviews = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new HandleError("product not found", 400))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})
//deleting review

export const deleteReview = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new HandleError("product not found", 400))
    }
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())
    let sum = 0;
    reviews.forEach(review => {
        sum += review.rating

    })
    const ratings = sum / reviews.length > 0 ? sum / reviews.length : 0;
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        message: "Review Deleted Successfully"

    })
})



//get all products by tag
export const getProductsByTag = handleAsyncError(async (req, res, next) => {
    const { tag } = req.params;
    const resultsPerPage = 8;
    const page = Number(req.query.page) || 1;

    let query;

    switch (tag) {
        case 'featured':
            query = Product.find({});
            break;
        case 'new-arrival':
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            query = Product.find({ createdAt: { $gte: thirtyDaysAgo } });
            break;
        case 'offer':
            query = Product.find({ offeredPrice: { $exists: true, $ne: null } });
            break;
        default:
            return next(new HandleError(`Invalid tag: ${tag}`, 400));
    }

    const apiFeatures = new APIFunctionality(query, req.query).search().filter();
    
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();
    const totalPages = Math.ceil(productCount / resultsPerPage);

    if (page > totalPages && productCount > 0) {
        return next(new HandleError("This page does not exist", 404));
    }

    apiFeatures.pagination(resultsPerPage);
    const products = await apiFeatures.query;

    if (!products || products.length === 0) {
        return next(new HandleError(`No products found with tag: ${tag}`, 404));
    }

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultsPerPage,
        totalPages,
        currentPage: page,
    });
});
//get all trending products
export const getTrendingProducts = handleAsyncError(async (req, res, next) => {
    const products = await Product.find({});

    if (!products) {
        return next(new HandleError("Products not found", 404));
    }

    res.status(200).json({
        success: true,
        products,
    });
});

//admin getting all product
export const getAdminProduct = handleAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
})