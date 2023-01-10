import connection from '../database/database.js';

async function createCakes(req, res) {
    const { name, price, image, description } = req.body;

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