import Joi from "joi";
import { Evenement } from "../../database/entities/evenement";
import { User } from "../../database/entities/user";

export const createEvenementUserValidation = Joi.object<CreateEvenementUserValidationRequest>({
    evenement: Joi.number().required(),
    user: Joi.number().required()
});

export interface CreateEvenementUserValidationRequest {
    evenement: Evenement
    user: User
}

export const evenementUserIdValidation = Joi.object<EvenementUserIdRequest>({
    id: Joi.number().required(),
});

export interface EvenementUserIdRequest {
    id: number
}

export const updateEvenementUserValidation = Joi.object<UpdateEvenementUserRequest>({
    id: Joi.number().required(),
    evenement: Joi.number().optional(),
    user: Joi.number().optional()
});

export interface UpdateEvenementUserRequest {
    id: number
    evenement?: Evenement
    user?: User
}

export const listEvenementUserValidation = Joi.object<ListEvenementUserRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    evenement: Joi.number().optional(),
    user: Joi.number().optional()
});

export interface ListEvenementUserRequest {
    page: number
    limit: number
    evenement?: number
    user?: number
}
