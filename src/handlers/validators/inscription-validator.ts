import Joi from "joi";
import { User } from "../../database/entities/user";
import { Evenement } from "../../database/entities/evenement";

export const createInscriptionValidation = Joi.object<CreateInscriptionValidationRequest>({
    user: Joi.number().required(),
    evenement: Joi.number().required()
});

export interface CreateInscriptionValidationRequest {
    user: User
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
    user: Joi.number().optional(),
    evenement: Joi.number().optional()
});

export interface UpdateInscriptionRequest {
    id: number
    user?: User
    evenement?: Evenement
}

export const listInscriptionValidation = Joi.object<ListInscriptionRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    user: Joi.number().optional(),
    evenement: Joi.number().optional()
});

export interface ListInscriptionRequest {
    page: number
    limit: number
    user?: number
    evenement?: number
}
