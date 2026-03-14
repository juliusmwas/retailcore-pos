// backend/src/routes/productRoutes.js
import express from 'express';
import { createProduct, getAllProducts, bulkDeleteProducts } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', createProduct);
router.delete('/bulk-delete', authenticateToken, bulkDeleteProducts);

export default router;