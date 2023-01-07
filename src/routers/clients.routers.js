import express from 'express';
import { createClients, getClientOrdersById } from '../controllers/clients.controller.js';

const router = express.Router();

router.post("/clients", createClients);
router.get("/clients/:id/orders", getClientOrdersById);

export default router;