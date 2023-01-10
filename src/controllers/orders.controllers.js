import connection from '../database/database.js';

async function createOrder(req, res) {
    const { clientId, cakeId, quantity, totalPrice, createdAt } = req.order;

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

        await connection.query(`
            INSERT INTO orders("clientId", "cakeId", quantity, "totalPrice", "createdAt") VALUES($1, $2, $3, $4, $5)
        `, [clientId, cakeId, quantity, totalPrice, createdAt]);

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
                orders.id AS "orderId", orders."createdAt", orders.quantity, orders."totalPrice", orders."isDelivered"
                FROM orders 
                JOIN clients ON orders."clientId" = clients.id
                JOIN cakes ON orders."cakeId" = cakes.id
                WHERE orders."createdAt" = $1;
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
                orders.id AS "orderId", orders."createdAt", orders.quantity, orders."totalPrice", orders."isDelivered" 
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

async function getOrderById(req, res) {
    const { id } = req.params;

    try {
        const { rows: orderById } = await connection.query(`
        SELECT 
        JSON_BUILD_OBJECT('id', clients.id, 'name', clients.name, 'address', clients.address, 'phone', clients.phone) AS client,
        JSON_BUILD_OBJECT('id', cakes.id, 'name', cakes.name, 'price', cakes.price, 'description', cakes.description, 'image', cakes.image) AS cake, 
        orders.id AS "orderId", orders."createdAt", orders.quantity, orders."totalPrice"
        FROM orders 
        JOIN clients ON orders."clientId" = clients.id
        JOIN cakes ON orders."cakeId" = cakes.id
        WHERE orders.id = $1;
        `, [id]);

        if(orderById[0]) {
            return res.status(200).send(orderById[0]);
        } else {
            return res.sendStatus(404);
        };
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

async function updateOrderById(req, res) { 
    const { id } = req.params;
    const isDelivered = true;

    try {
        const { rows: order } = await connection.query(`
            SELECT "isDelivered" FROM orders WHERE id = $1;
        `, [id]);

        if(order[0]) {
            await connection.query(`
                UPDATE orders SET "isDelivered" = $1 WHERE id = $2;
            `, [isDelivered, id]);

            return res.sendStatus(204);
        } else {
            return res.sendStatus(404);
        };
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export { createOrder, getOrders, getOrderById, updateOrderById };