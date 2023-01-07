import express from 'express';
import cors from 'cors';

import cakeRouter from './routers/cakes.routers.js';
import clientRouter from './routers/clients.routers.js';
/* import orderRouter from './routers/orders.routers.js'; */

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES:
app.use(cakeRouter);
app.use(clientRouter);
/* app.use(orderRouter); */

app.listen(4000, () => console.log("Executando..."));