// backend/src/routes/productRoutes.js
import express from 'express';
import { createProduct, getAllProducts, bulkDeleteProducts, updateProduct } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', createProduct);
router.delete('/bulk-delete', authenticateToken, bulkDeleteProducts);
router.put('/:id', authenticateToken, updateProduct);

export default router;