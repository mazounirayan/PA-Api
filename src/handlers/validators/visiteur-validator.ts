import Joi from "joi";

export const createVisiteurValidation = Joi.object<CreateVisiteurValidationRequest>({
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().required(),
    numTel: Joi.string().required(),
    adresse: Joi.string().required(),
    profession: Joi.string().required(),
    dateInscription: Joi.date().required(),
    estBenevole: Joi.boolean().required()
}).options({ abortEarly: false });

export interface CreateVisiteurValidationRequest {
    nom: string
    prenom: string
    email: string
    age: number
    numTel: string
    adresse: string
    profession: string
    dateInscription: Date
    estBenevole: boolean
}

export const visiteurIdValidation = Joi.object<VisiteurIdRequest>({
    id: Joi.number().required(),
});

export interface VisiteurIdRequest {
    id: number
}

export const updateVisiteurValidation = Joi.object<UpdateVisiteurRequest>({
    id: Joi.number().required(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    email: Joi.string().email().optional(),
    age: Joi.number().optional(),
    numTel: Joi.string().optional(),
    adresse: Joi.string().optional(),
    profession: Joi.string().optional(),
    estBenevole: Joi.boolean().optional()
});

export interface UpdateVisiteurRequest {
    id: number
    nom?: string
    prenom?: string
    email?: string
    age?: number
    numTel?: string
    adresse?: string
    profession?: string
    estBenevole?: boolean
}

export const listVisiteurValidation = Joi.object<ListVisiteurRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    email: Joi.string().email().optional(),
    age: Joi.number().optional(),
    numTel: Joi.string().optional(),
    adresse: Joi.string().optional(),
    profession: Joi.string().optional(),
    estBenevole: Joi.boolean().optional()
});

export interface ListVisiteurRequest {
    page: number
    limit: number
    nom?: string
    prenom?: string
    email?: string
    age?: number
    numTel?: string
    adresse?: string
    profession?: string
    estBenevole?: boolean
}
