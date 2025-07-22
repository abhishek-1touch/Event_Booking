import express from 'express';
import authRoutes from './authRoutes.js';
// import userRoutes from './userRoutes.js';
// import adminRoutes from './adminRoutes.js';
// import eventRoutes from './eventRoutes.js';

const router = express.Router();

// Mount all routes with prefixes
router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/admin', adminRoutes);
// router.use('/events', eventRoutes);

export default router;
