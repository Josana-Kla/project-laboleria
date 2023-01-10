import dayjs from 'dayjs';
import connection from '../database/database.js';
import { orderSchema } from '../schemas/orders.schema.js';

function currentDate() {
    return dayjs().format('YYYY-MM-DD');
};

async function calculateTotalPriceOrder(cakeId, quantity) {
    try {
        const cakePrice = await connection.query(`
            SELECT price FROM cakes WHERE id = $1;
        `, [cakeId]);

        const priceValue = cakePrice.rows[0].price;

        if(priceValue) {
            const calcTotal = priceValue * quantity;
            console.log(`O preço total do pedido é: ${priceValue} - preço do bolo x ${quantity} - quantidade = ${calcTotal}`);
            return calcTotal;
        };
    } catch (error) {
        console.log(error);
        console.log("Erro no servidor ao calcular o preço total do pedido!");
    }
};

async function createOrdersMiddleware(req, res, next) {
    const { clientId, cakeId, quantity } = req.body;
    const createdAt = currentDate();
    const validation = orderSchema.validate(req.body, {abortEarly: false});
    const totalPrice = await calculateTotalPriceOrder(cakeId, quantity); 
    const order = {
        clientId, 
        cakeId, 
        quantity,
        totalPrice,
        createdAt
    };

    if(validation.error) {
        const error = validation.error.details.map(detail => detail.message);

        return res.status(400).send(error);
    };

    req.order = order;
    
    next();
};

export { createOrdersMiddleware };