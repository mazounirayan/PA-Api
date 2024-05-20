import Joi from "joi";
import { Demande } from "../../database/entities/demande";

export const createEvenementDemandeValidation = Joi.object<CreateEvenementDemandeValidationRequest>({
    nom: Joi.string().required(),
    date: Joi.date().required(),
    description: Joi.string().required(),
    lieu: Joi.string().required(),
    demande: Joi.number().required()
});

export interface CreateEvenementDemandeValidationRequest {
    nom: string
    date: Date
    description: string
    lieu: string
    demande: Demande
}

export const evenementDemandeIdValidation = Joi.object<EvenementDemandeIdRequest>({
    id: Joi.number().required(),
});

export interface EvenementDemandeIdRequest {
    id: number
}

export const updateEvenementDemandeValidation = Joi.object<UpdateEvenementDemandeRequest>({
    id: Joi.number().required(),
    nom: Joi.string().optional(),
    date: Joi.date().optional(),
    description: Joi.string().optional(),
    lieu: Joi.string().optional(),
    demande: Joi.number().optional()
});

export interface UpdateEvenementDemandeRequest {
    id: number
    nom?: string
    date?: Date
    description?: string
    lieu?: string
    demande?: Demande
}

export const listEvenementDemandeValidation = Joi.object<ListEvenementDemandeRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
    date: Joi.date().optional(),
    description: Joi.string().optional(),
    lieu: Joi.string().optional(),
    demande: Joi.number().optional()
});

export interface ListEvenementDemandeRequest {
    page: number
    limit: number
    nom?: string
    date?: Date
    description?: string
    lieu?: string
    demande?: number
}
