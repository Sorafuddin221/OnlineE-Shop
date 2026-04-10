import express from 'express';
import { getApiKey } from '../controller/apiKeyController.js';

const router = express.Router();

router.route('/apiKey').get(getApiKey);

export default router;
