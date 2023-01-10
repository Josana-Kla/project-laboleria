import { cakeSchema } from "../schemas/cakes.schema.js";

function createCakesMiddleware(req, res, next) {
    const validation = cakeSchema.validate(req.body, {abortEarly: false});

    if(validation.error) {
        const error = validation.error.details.map(detail => detail.message);

        return res.status(400).send(error);
    };

    next();
};

export { createCakesMiddleware };