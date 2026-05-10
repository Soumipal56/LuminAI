import express from 'express';
import { createShare, getShare } from '../controllers/share.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authUser, createShare);
router.get('/:shareId', getShare);

export default router;
