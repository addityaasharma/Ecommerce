import { Router } from 'express';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import { validateSchema } from '../../../middleware/schema.middleware.js';
import { categoryValidator, updateCategoryValidator } from '@repo/validators';
import { categoryByIdController, categoryController, categoryDeleteController, categoryDetailsController, categoryUpdateController } from './category.controller.js';

const router: Router = Router()

router.post('/', adminMiddleware, validateSchema(categoryValidator), categoryController);
router.get('/:id', categoryByIdController);
router.get('/', categoryDetailsController);
router.put('/:id', adminMiddleware, validateSchema(updateCategoryValidator), categoryUpdateController);
router.delete('/:id', adminMiddleware, categoryDeleteController);

export default router;