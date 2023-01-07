import express from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/orders.controller.js';

const router = express.Router();

router.post("/order", createOrder);
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);

export default router;