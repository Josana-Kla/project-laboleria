import joi from 'joi';

export const cakeSchema = joi.object({
    name: joi.string().pattern(/^[A-zÀ-ú]/).min(2).required().empty(' '),
    price: joi.number().integer().greater(0).required(),
    image: joi.string().uri().required().empty(' '),
    description: joi.string()
}); 