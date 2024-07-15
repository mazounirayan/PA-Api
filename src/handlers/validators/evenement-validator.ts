import Joi from "joi";

export const createEvenementValidation = Joi.object<CreateEvenementValidationRequest>({
    nom: Joi.string().required(),
    date: Joi.date().required(),
    description: Joi.string().required(),
    lieu: Joi.string().required(),
    estReserve: Joi.boolean().required(),
    nbPlace: Joi.number().integer().required()
});

export interface CreateEvenementValidationRequest {
    nom: string
    date: Date
    description: string
    lieu: string
    estReserve: boolean
    nbPlace: number
}

export const evenementIdValidation = Joi.object<EvenementIdRequest>({
    id: Joi.number().required(),
});

export interface EvenementIdRequest {
    id: number
}

export const updateEvenementValidation = Joi.object<UpdateEvenementRequest>({
    id: Joi.number().required(),
    nom: Joi.string().optional(),
    date: Joi.date().optional(),
    description: Joi.string().optional(),
    lieu: Joi.string().optional(),
    estReserve: Joi.boolean().optional(),
    nbPlace: Joi.number().integer().optional()
});

export interface UpdateEvenementRequest {
    id: number
    nom?: string
    date?: Date
    description?: string
    lieu?: string
    estReserve?: boolean
    nbPlace?: number
}

export const listEvenementValidation = Joi.object<ListEvenementRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
    date: Joi.date().optional(),
    description: Joi.string().optional(),
    lieu: Joi.string().optional(),
    estReserve: Joi.boolean().optional(),
    nbPlace: Joi.number().integer().optional()
});

export interface ListEvenementRequest {
    page: number
    limit: number
    nom?: string
    date?: Date
    description?: string
    lieu?: string
    estReserve?: boolean
    nbPlace?: number
}
