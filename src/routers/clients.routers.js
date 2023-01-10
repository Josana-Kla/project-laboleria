import express from 'express';
import { createClients, getClientOrdersById } from '../controllers/clients.controllers.js';
import { createClientsMiddleware } from '../middlewares/clients.middlewares.js';

const router = express.Router();

router.post("/clients", createClientsMiddleware, createClients);
router.get("/clients/:id/orders", getClientOrdersById);

export default router;