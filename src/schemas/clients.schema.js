import joi from 'joi';

export const clientSchema = joi.object({
    name: joi.string().pattern(/^[A-zÀ-ú]/).required().empty(' '),
    address: joi.string().required().empty(' '),
    phone: joi.string().pattern(/^[0-9]+$/).min(10).max(11).required().empty(' ')
}); 