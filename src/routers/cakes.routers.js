import express from 'express';
import { createCakes } from '../controllers/cakes.controllers.js';
import { createCakesMiddleware } from '../middlewares/cakes.middlewares.js';

const router = express.Router();

router.post("/cakes", createCakesMiddleware, createCakes);

export default router;