import Joi from "joi";
import { User } from "../../database/entities/user";

export const createVisiteurValidation = Joi.object<CreateVisiteurValidationRequest>({
    email: Joi.string().email().required(),
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    age: Joi.number().integer().required(),
    numTel: Joi.string().required(),
    adresse: Joi.string().required(),
    profession: Joi.string().required(),
    estBenevole: Joi.boolean().required(),
    parrain: Joi.number().optional()
}).options({ abortEarly: false })

export interface CreateVisiteurValidationRequest {
    email: string
    nom: string
    prenom: string
    age: number
    numTel: string
    adresse: string
    profession: string
    estBenevole: boolean
    parrain?: User
}

export const visiteurEmailValidation = Joi.object<VisiteurEmailRequest>({
    email: Joi.string().email().required(),
});

export interface VisiteurEmailRequest {
    email: string
}

export const updateVisiteurValidation = Joi.object<UpdateVisiteurRequest>({
    email: Joi.string().email().required(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    age: Joi.number().integer().optional(),
    numTel: Joi.string().optional(),
    adresse: Joi.string().optional(),
    profession: Joi.string().optional(),
    estBenevole: Joi.boolean().optional(),
    parrain: Joi.number().optional()
});

export interface UpdateVisiteurRequest {
    email: string
    nom?: string
    prenom?: string
    age?: number
    numTel?: string
    adresse?: string
    profession?: string
    estBenevole?: boolean
    parrain?: User
}

export const listVisiteurValidation = Joi.object<ListVisiteurRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    email: Joi.string().email().optional(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    age: Joi.number().integer().optional(),
    numTel: Joi.string().optional(),
    adresse: Joi.string().optional(),
    profession: Joi.string().optional(),
    dateInscription: Joi.date().optional(),
    estBenevole: Joi.boolean().optional(),
    parrain: Joi.number().optional()
});

export interface ListVisiteurRequest {
    page: number
    limit: number
    email?: string
    nom?: string
    prenom?: string
    age?: number
    numTel?: string
    adresse?: string
    profession?: string
    dateInscription?: Date
    estBenevole?: boolean
    parrain?: number
}
