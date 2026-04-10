import express from 'express';
import {
      createReviewForProduct, creatProducts,
      deleteProduct, deleteReview, getAdminProduct, getAllProducts,
      getproductReviews, getSingleProduct, updateProduct,
      getProductsByTag,
      getTrendingProducts
} from '../controller/productController.js';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';
const router = express.Router();


//Routes
router.route("/products")
      .get(getAllProducts);
router.route('/products/tag/:tag').get(getProductsByTag);
router.route('/products/trending').get(getTrendingProducts);

router.route("/admin/products")
      .get(verifyUserAuth, roleBasedAccess("admin"), getAdminProduct);
router.route("/admin/product/create")
      .post(verifyUserAuth, roleBasedAccess("admin"), creatProducts);
//app.post("api/v1/products" ,creatProduct)
router.route("/admin/product/:id")
      .put(verifyUserAuth, roleBasedAccess("admin"), updateProduct)
      .delete(verifyUserAuth, roleBasedAccess("admin"), deleteProduct);

router.route("/product/:id").get(getSingleProduct)
router.route("/review").put(verifyUserAuth, createReviewForProduct)
router.route("/admin/reviews").get(verifyUserAuth, roleBasedAccess
      ("admin"),getproductReviews).delete(verifyUserAuth, roleBasedAccess
       ("admin"),deleteReview)





export default router;
