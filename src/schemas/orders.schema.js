import joi from 'joi';

export const orderSchema = joi.object({
    clientId:  joi.number().integer().required(),
    cakeId:  joi.number().integer().required(),
    quantity: joi.number().integer().greater(0).less(5).required()
}); 