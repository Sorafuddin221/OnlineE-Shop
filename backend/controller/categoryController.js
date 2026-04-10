import Category from '../models/categoryModel.js';
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import { v2 as cloudinary } from 'cloudinary';

// Create a new category
export const createCategory = handleAsyncError(async (req, res, next) => {
    let image = [];
    if (typeof req.body.image === "string") {
        image.push(req.body.image);
    } else {
        image = req.body.image;
    }

    const imageLinks = [];
    if (image && image.length > 0) {
        for (let i = 0; i < image.length; i++) {
            const result = await cloudinary.uploader.upload(image[i], {
                folder: 'categories'
            });
            imageLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }
    }
    
    req.body.image = imageLinks;
    const category = await Category.create(req.body);
    res.status(201).json({
        success: true,
        category,
    });
});

// Get all categories
export const getAllCategories = handleAsyncError(async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).json({
        success: true,
        categories,
    });
});

// Update a category
export const updateCategory = handleAsyncError(async (req, res, next) => {
    let category = await Category.findById(req.params.id);
    if (!category) {
        return next(new HandleError('Category not found', 404));
    }

    let images = [];
    if (typeof req.body.image === 'string') {
        images.push(req.body.image);
    } else if (Array.isArray(req.body.image)) {
        images = req.body.image;
    }

    if (images && images.length > 0) {
        // Deleting images from cloudinary
        if (category.image && category.image.length > 0 && !images[0].startsWith('http')) {
            for (let i = 0; i < category.image.length; i++) {
                await cloudinary.uploader.destroy(category.image[i].public_id);
            }
        }
       
        const imageLinks = [];
        for (let i = 0; i < images.length; i++) {
            // Do not re-upload if the image is already a cloudinary url
            if (images[i].startsWith('http')) {
                const public_id = category.image[i].public_id
                imageLinks.push({ public_id: public_id, url: images[i] });
                continue;
            }
            const result = await cloudinary.uploader.upload(images[i], {
                folder: 'categories'
            });
            imageLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }
        req.body.image = imageLinks;
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        category,
    });
});

// Delete a category
export const deleteCategory = handleAsyncError(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return next(new HandleError('Category not found', 404));
    }

    // Deleting image from cloudinary
    if (category.image && category.image.length > 0) {
        for (let i = 0; i < category.image.length; i++) {
            await cloudinary.uploader.destroy(category.image[i].public_id);
        }
    }

    await category.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
    });
});
