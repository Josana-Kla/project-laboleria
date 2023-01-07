import connection from '../database/database.js';
import joi from 'joi';

const clientSchema = joi.object({
    name: joi.string().pattern(/^[A-zÀ-ú]/).required().empty(' '),
    address: joi.string().required().empty(' '),
    phone: joi.string().pattern(/^[0-9]+$/).min(10).max(11).required().empty(' ')
}); 

async function createClients(req, res) {
    const { name, address, phone } = req.body;
    const validation = clientSchema.validate(req.body, {abortEarly: false});

    if(validation.error) {
        const error = validation.error.details.map(detail => detail.message);

        return res.status(400).send(error);
    };

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

export { createClients };