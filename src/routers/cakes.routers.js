import express from 'express';
import { createCakes } from '../controllers/cakes.controller.js';

const router = express.Router();

router.post("/cakes", createCakes);

export default router;