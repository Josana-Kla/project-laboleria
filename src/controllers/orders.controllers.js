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

async function getOrders(req, res) {
    const { date } = req.query;

    try {
        if(date) {
            const { rows: ordersByDate } = await connection.query(`
                SELECT 
                JSON_BUILD_OBJECT('id', clients.id, 'name', clients.name, 'address', clients.address, 'phone', clients.phone) AS client,
                JSON_BUILD_OBJECT('id', cakes.id, 'name', cakes.name, 'price', cakes.price, 'description', cakes.description, 'image', cakes.image) AS cake, 
                orders.id AS "orderId", orders."createdAt", orders.quantity, orders."totalPrice"
                FROM orders 
                JOIN clients ON orders."clientId" = clients.id
                JOIN cakes ON orders."cakeId" = cakes.id
                WHERE "createdAt" LIKE $1 || '%';
            `, [date]);

            if(!ordersByDate[0]) {
                return res.status(404).send([]);
            };

            return res.status(200).send(ordersByDate);
        } else {
            const { rows: allOrders } = await connection.query(`
                SELECT 
                JSON_BUILD_OBJECT('id', clients.id, 'name', clients.name, 'address', clients.address, 'phone', clients.phone) AS client,
                JSON_BUILD_OBJECT('id', cakes.id, 'name', cakes.name, 'price', cakes.price, 'description', cakes.description, 'image', cakes.image) AS cake, 
                orders.id AS "orderId", orders."createdAt", orders.quantity, orders."totalPrice" 
                FROM orders 
                JOIN clients ON orders."clientId" = clients.id
                JOIN cakes ON orders."cakeId" = cakes.id;
            `);

            if(!allOrders[0]) {
                return res.status(404).send([]);
            };

            return res.status(200).send(allOrders);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export { createOrder, getOrders };