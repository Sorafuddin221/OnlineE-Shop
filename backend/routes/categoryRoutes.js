import express from 'express';
import {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
} from '../controller/categoryController.js';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';

const router = express.Router();

router.route('/categories').get(getAllCategories);
router.route('/admin/categories').get(verifyUserAuth, roleBasedAccess('admin'), getAllCategories);
router.route('/admin/category/create').post(verifyUserAuth, roleBasedAccess('admin'), createCategory);
router.route('/admin/category/:id')
    .put(verifyUserAuth, roleBasedAccess('admin'), updateCategory)
    .delete(verifyUserAuth, roleBasedAccess('admin'), deleteCategory);

export default router;
