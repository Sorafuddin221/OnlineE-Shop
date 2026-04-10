import express from 'express';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';
import { allMyOrders, createNewOrder, deleteMyOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrder, updateOrderStatus } from '../controller/orderController.js';

const router = express.Router();

router.route('/new/order').post(verifyUserAuth, createNewOrder)
router.route('/order/:id')
    .get(verifyUserAuth, getSingleOrder)
    .put(verifyUserAuth, updateOrder)
    .delete(verifyUserAuth,deleteMyOrder)
router.route('/admin/order/:id')
    .put(verifyUserAuth, roleBasedAccess('admin'), updateOrderStatus)
    .delete(verifyUserAuth, roleBasedAccess('admin'), deleteOrder)
router.route('/admin/orders').get(verifyUserAuth, roleBasedAccess('admin'), getAllOrders)

router.route('/orders/user').get(verifyUserAuth, allMyOrders)


export default router;