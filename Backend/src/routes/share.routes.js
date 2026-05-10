import express from 'express';
import { createShare, getShare } from '../controllers/share.controller.js';
import { authUser } from '../middleware/auth.middleware.js';
import ROUTES from '../config/routes.config.js';

const router = express.Router();

router.post(ROUTES.shares.create, authUser, createShare);
router.get(ROUTES.shares.get, getShare);

export default router;
