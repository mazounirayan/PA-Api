import Joi from "joi";
import { Evenement } from "../../database/entities/evenement";

export const createInscriptionValidation = Joi.object<CreateInscriptionValidationRequest>({
    emailVisiteur: Joi.string().email().required(),
    evenement: Joi.number().required()
}).options({ abortEarly: false })

export interface CreateInscriptionValidationRequest {
    emailVisiteur: string
    evenement: Evenement
}

export const deleteInscriptionValidationRequest = Joi.object<DeleteInscriptionValidationRequest>({
    emailVisiteur: Joi.string().email().required(),
    evenement: Joi.number().required()
}).options({ abortEarly: false })

export interface DeleteInscriptionValidationRequest {
    emailVisiteur: string
    evenement: number
}
export const inscriptionIdValidation = Joi.object<InscriptionIdRequest>({
    id: Joi.number().required(),
});

export interface InscriptionIdRequest {
    id: number
}

export const updateInscriptionValidation = Joi.object<UpdateInscriptionRequest>({
    id: Joi.number().required(),
    emailVisiteur: Joi.string().email().optional(),
    evenement: Joi.number().optional()
});

export interface UpdateInscriptionRequest {
    id: number
    emailVisiteur?: string
    evenement?: Evenement
}


export const verifEmail = Joi.object<VerifEmail>({
    emailVisiteur: Joi.string().email().required(),
    evenement: Joi.number().required()
}).options({ abortEarly: false })

export interface VerifEmail {
    emailVisiteur: string
    evenement: number
}


export const listInscriptionValidation = Joi.object<ListInscriptionRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    emailVisiteur: Joi.string().email().optional(),
    evenement: Joi.number().optional()
});

export interface ListInscriptionRequest {
    page: number
    limit: number
    emailVisiteur?: string
    evenement?: number
}
