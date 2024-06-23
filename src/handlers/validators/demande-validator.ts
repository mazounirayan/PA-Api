import Joi from "joi";
import { TypeDemande, StatutDemande } from "../../database/entities/demande";

export const createDemandeValidation = Joi.object<CreateDemandeValidationRequest>({
    type: Joi.string().valid(...Object.values(TypeDemande)).required(),
    dateDemande: Joi.date().required(),
    statut: Joi.string().valid(...Object.values(StatutDemande)).required(),
    emailVisiteur: Joi.string().email().required()
}).options({ abortEarly: false })

export interface CreateDemandeValidationRequest {
    type: TypeDemande
    dateDemande: Date
    statut: StatutDemande
    emailVisiteur: string
}

export const demandeIdValidation = Joi.object<DemandeIdRequest>({
    id: Joi.number().required(),
});

export interface DemandeIdRequest {
    id: number
}

export const updateDemandeValidation = Joi.object<UpdateDemandeRequest>({
    id: Joi.number().required(),
    type: Joi.string().valid(...Object.values(TypeDemande)).optional(),
    dateDemande: Joi.date().optional(),
    statut: Joi.string().valid(...Object.values(StatutDemande)).optional(),
    emailVisiteur: Joi.string().email().optional()
});

export interface UpdateDemandeRequest {
    id: number
    type?: TypeDemande
    dateDemande?: Date
    statut?: StatutDemande
    emailVisiteur?: string
}

export const listDemandeValidation = Joi.object<ListDemandeRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    type: Joi.string().valid(...Object.values(TypeDemande)).optional(),
    dateDemande: Joi.date().optional(),
    statut: Joi.string().valid(...Object.values(StatutDemande)).optional(),
    emailVisiteur: Joi.string().email().optional()
});

export interface ListDemandeRequest {
    page: number
    limit: number
    type?: TypeDemande
    dateDemande?: Date
    statut?: StatutDemande
    emailVisiteur?: string
}