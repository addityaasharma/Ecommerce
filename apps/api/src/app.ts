import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './modules/user/user.routes.js';
import adminRoutes from './modules/admin/admin.routes.js'
import adminCategoryRoutes from './modules/admin/category/category.routes.js'
import adminProductRoutes from './modules/admin/product/product.routes.js'

const app: Express = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}


app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/user', userRoutes);
app.use('/admin', adminRoutes)
app.use('/admin/category', adminCategoryRoutes)
app.use('/admin/product', adminProductRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});
app.use(
  (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    const statusCode = err.statusCode ?? 500;
    res.status(statusCode).json({
      success: false,
      message: err.message ?? 'Internal server error',
    });
  }
);

export default app;