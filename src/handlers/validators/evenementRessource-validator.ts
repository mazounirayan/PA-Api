import Joi from "joi";
import { Evenement } from "../../database/entities/evenement";
import { Ressource } from "../../database/entities/ressource";

export const createEvenementRessourceValidation = Joi.object<CreateEvenementRessourceValidationRequest>({
    evenement: Joi.number().required(),
    ressource: Joi.number().required()
});

export interface CreateEvenementRessourceValidationRequest {
    evenement: Evenement
    ressource: Ressource
}

export const evenementRessourceIdValidation = Joi.object<EvenementRessourceIdRequest>({
    id: Joi.number().required(),
});

export interface EvenementRessourceIdRequest {
    id: number
}

export const updateEvenementRessourceValidation = Joi.object<UpdateEvenementRessourceRequest>({
    id: Joi.number().required(),
    evenement: Joi.number().optional(),
    ressource: Joi.number().optional()
});

export interface UpdateEvenementRessourceRequest {
    id: number
    evenement?: Evenement
    ressource?: Ressource
}

export const listEvenementRessourceValidation = Joi.object<ListEvenementRessourceRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    evenement: Joi.number().optional(),
    ressource: Joi.number().optional()
});

export interface ListEvenementRessourceRequest {
    page: number
    limit: number
    evenement?: number
    ressource?: number
}
