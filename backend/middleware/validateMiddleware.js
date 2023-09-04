const Joi = require('joi')


const middlewareValidate = (schema) => {
    return (req, res, next) => {

        // validate data in body, params, query
        const { body, params, query } = req;
        const { error } = schema.validate({ body, params, query });

        // const { error } = schema.validate(req.body);
        if (error) {
           return res.status(400).json(error.details)
        }
        next()
    }
}

const updateUserSchema = Joi.object({
    body: Joi.object({
        username: Joi.string()
        .alphanum()
        .max(30),
        email: Joi.string()
        ,
        phone: Joi.string()
        .regex(/^(?:\+84|0)(?:\d){9,10}$/),
        address: Joi.string()
        .regex(/^[a-zA-Z0-9\s]+$/)
    }),
    query: Joi.object({}),
    params: Joi.object({})
})

const updatePasswordSchema = Joi.object({
    body: Joi.object({
        newPassword: Joi.string()
        .min(7)
        .regex(/^(?=.*[A-Z])(?=.*\d).+$/),
        oldPassword: Joi.string()
        .min(7)
        .regex(/^(?=.*[A-Z])(?=.*\d).+$/)
    }),
    query: Joi.object({}),
    params: Joi.object({})
})

module.exports = {
    middlewareValidate,
    updateUserSchema,
    updatePasswordSchema
}