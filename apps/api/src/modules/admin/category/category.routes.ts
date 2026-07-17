import { Router } from 'express';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import { validateSchema } from '../../../middleware/schema.middleware.js';
import { categoryValidator } from '@repo/validators';

const router: Router = Router()


router.post('/', adminMiddleware, validateSchema(categoryValidator), categoryController);


export default router;