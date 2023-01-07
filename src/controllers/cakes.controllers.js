import connection from '../database/database.js';
import joi from 'joi';

const cakeSchema = joi.object({
    name: joi.string().pattern(/^[A-zÀ-ú]/).min(2).required().empty(' '),
    price: joi.number().integer().greater(0).required(),
    image: joi.string().uri().required().empty(' '),
    description: joi.string()
}); 

async function createCakes(req, res) {
    const { name, price, image, description } = req.body;
    const validation = cakeSchema.validate(req.body, {abortEarly: false});

    if(validation.error) {
        const error = validation.error.details.map(detail => detail.message);

        return res.status(400).send(error);
    };

    try {
        const cakeExists = await connection.query(`
            SELECT * FROM cakes WHERE name = $1;
        `, [name]);

        if(cakeExists.rows[0] === undefined) {
            await connection.query(`
                INSERT INTO cakes(name, price, image, description) VALUES($1, $2, $3, $4)
            `, [name, price, image, description]);

            return res.sendStatus(201);
        } else {
            return res.sendStatus(409);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export { createCakes };