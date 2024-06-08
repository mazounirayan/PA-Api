import Joi from "joi";
import { Evenement } from "../../database/entities/evenement";
import { Visiteur } from "../../database/entities/visiteur";

export const createInscriptionValidation = Joi.object<CreateInscriptionValidationRequest>({
    visiteur: Joi.number().required(),
    evenement: Joi.number().required()
}).options({ abortEarly: false });

export interface CreateInscriptionValidationRequest {
    visiteur: Visiteur
    evenement: Evenement
}

export const inscriptionIdValidation = Joi.object<InscriptionIdRequest>({
    id: Joi.number().required(),
});

export interface InscriptionIdRequest {
    id: number
}

export const updateInscriptionValidation = Joi.object<UpdateInscriptionRequest>({
    id: Joi.number().required(),
    visiteur: Joi.number().optional(),
    evenement: Joi.number().optional()
});

export interface UpdateInscriptionRequest {
    id: number
    visiteur?: Visiteur
    evenement?: Evenement
}

export const listInscriptionValidation = Joi.object<ListInscriptionRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    visiteur: Joi.number().optional(),
    evenement: Joi.number().optional()
});

export interface ListInscriptionRequest {
    page: number
    limit: number
    visiteur?: number
    evenement?: number
}
