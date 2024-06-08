import Joi from "joi";

export const createSondageValidation = Joi.object<CreateSondageValidationRequest>({
    nom: Joi.string().max(255).required(),
    date: Joi.date().required(),
    description: Joi.string().required(),
    type: Joi.string().max(50).optional().allow(null)
}).options({ abortEarly: false })

export interface CreateSondageValidationRequest {
    nom: string
    date: Date
    description: string
    type?: string
}

export const sondageIdValidation = Joi.object<SondageIdRequest>({
    id: Joi.number().required(),
});

export interface SondageIdRequest {
    id: number
}

export const updateSondageValidation = Joi.object<UpdateSondageRequest>({
    id: Joi.number().required(),
    nom: Joi.string().max(255).optional(),
    date: Joi.date().optional(),
    description: Joi.string().optional(),
    type: Joi.string().max(50).optional().allow(null)
}).options({ abortEarly: false });

export interface UpdateSondageRequest {
    id: number
    nom?: string
    date?: Date
    description?: string
    type?: string
}

export const listSondageValidation = Joi.object<ListSondageRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
    date: Joi.date().optional(),
    description: Joi.string().optional(),
    type: Joi.string().optional()
});

export interface ListSondageRequest {
    page: number
    limit: number
    nom?: string
    date?: Date
    description?: string
    type?: string
}
