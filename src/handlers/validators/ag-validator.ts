import Joi from "joi";

export const createAgValidation = Joi.object<CreateAgValidationRequest>({
    nom: Joi.string().max(255).required(),
    date: Joi.date().required(),
    description: Joi.string().required(),
    type: Joi.string().max(50).required(),
    quorum: Joi.number().integer().required()
}).options({ abortEarly: false })

export interface CreateAgValidationRequest {
    nom: string
    date: Date
    description: string
    type: string
    quorum: number
}

export const agIdValidation = Joi.object<AgIdRequest>({
    id: Joi.number().required(),
});

export interface AgIdRequest {
    id: number
}

export const updateAgValidation = Joi.object<UpdateAgRequest>({
    id: Joi.number().required(),
    nom: Joi.string().max(255).optional(),
    date: Joi.date().optional(),
    description: Joi.string().optional(),
    type: Joi.string().max(50).optional(),
    quorum: Joi.number().integer().optional()
});

export interface UpdateAgRequest {
    id: number
    nom?: string
    date?: Date
    description?: string
    type?: string
    quorum?: number
}

export const listAgValidation = Joi.object<ListAgRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
    date: Joi.date().optional(),
    description: Joi.string().optional(),
    type: Joi.string().optional(),
    quorum: Joi.number().integer().optional()
});

export interface ListAgRequest {
    page: number
    limit: number
    nom?: string
    date?: Date
    description?: string
    type?: string
    quorum?: number
}
