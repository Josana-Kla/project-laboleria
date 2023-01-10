import connection from '../database/database.js';

async function createClients(req, res) {
    const { name, address, phone } = req.body;

    try {
        await connection.query(`
            INSERT INTO clients(name, address, phone) VALUES($1, $2, $3)
        `, [name, address, phone]);

        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

async function getClientOrdersById(req, res) { 
    const { id } = req.params;

    try {
        const { rows: clientById } = await connection.query(`
            SELECT 
            orders.id AS "orderId", orders.quantity, orders."createdAt", orders."totalPrice",
            cakes.name AS "cakeName" 
            FROM orders 
            JOIN clients ON orders."clientId" = clients.id
            JOIN cakes ON orders."cakeId" = cakes.id
            WHERE clients.id = $1;
        `, [id]);

        if(clientById[0]) {
            return res.status(200).send(clientById[0]);
        } else {
            return res.sendStatus(404);
        };
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export { createClients, getClientOrdersById };