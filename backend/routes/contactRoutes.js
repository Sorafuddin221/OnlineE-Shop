import express from 'express';
import { contactUs } from '../controller/contactController.js';

const router = express.Router();

router.route("/contact").post(contactUs);

export default router;
