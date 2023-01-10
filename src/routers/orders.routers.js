import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderById } from '../controllers/orders.controllers.js';
import { createOrdersMiddleware } from '../middlewares/orders.middlewares.js';

const router = express.Router();

router.post("/order", createOrdersMiddleware, createOrder);
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.patch("/order/:id", updateOrderById);

export default router;