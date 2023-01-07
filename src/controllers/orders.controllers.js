import connection from '../database/database.js';
import joi from 'joi';

const orderSchema = joi.object({
    clientId:  joi.number().integer().required(),
    cakeId:  joi.number().integer().required(),
    quantity: joi.number().integer().greater(0).less(5).required()
}); 

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

async function createOrder(req, res) {
    const { clientId, cakeId, quantity } = req.body;
    const validation = orderSchema.validate(req.body, {abortEarly: false});

    if(validation.error) {
        const error = validation.error.details.map(detail => detail.message);

        return res.status(400).send(error);
    };

    try {
        const { rows: getClientId } = await connection.query(`
            SELECT id FROM clients WHERE id = $1;
        `, [clientId]);

        if(!getClientId[0]) {
            return res.sendStatus(404);
        };

        const { rows: getCakeId } = await connection.query(`
            SELECT id FROM cakes WHERE id = $1;
        `, [cakeId]);

        if(!getCakeId[0]) {
            return res.sendStatus(404);
        };

        const totalPrice = await calculateTotalPriceOrder(cakeId, quantity); 

        await connection.query(`
            INSERT INTO orders("clientId", "cakeId", quantity, "totalPrice") VALUES($1, $2, $3, $4)
        `, [clientId, cakeId, quantity, totalPrice]);

        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export { createOrder };