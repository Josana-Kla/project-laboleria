import { clientSchema } from "../schemas/clients.schema.js";

function createClientsMiddleware(req, res, next) {
    const validation = clientSchema.validate(req.body, {abortEarly: false});

    if(validation.error) {
        const error = validation.error.details.map(detail => detail.message);

        return res.status(400).send(error);
    };

    next();
};

export { createClientsMiddleware };