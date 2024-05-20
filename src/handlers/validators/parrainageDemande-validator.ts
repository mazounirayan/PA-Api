import Joi from "joi";
import { User } from "../../database/entities/user";
import { Demande } from "../../database/entities/demande";

export const createParrainageDemandeValidation = Joi.object<CreateParrainageDemandeValidationRequest>({
    detailsParrainage: Joi.string().required(),
    parrain: Joi.number().required(),
    demande: Joi.number().required()
}).options({ abortEarly: false })

export interface CreateParrainageDemandeValidationRequest {
    detailsParrainage: string
    parrain: User
    demande: Demande
}

export const parrainageDemandeIdValidation = Joi.object<ParrainageDemandeIdRequest>({
    id: Joi.number().required(),
});

export interface ParrainageDemandeIdRequest {
    id: number
}

export const updateParrainageDemandeValidation = Joi.object<UpdateParrainageDemandeRequest>({
    id: Joi.number().required(),
    detailsParrainage: Joi.string().optional(),
    parrain: Joi.number().optional(),
    demande: Joi.number().optional()
});

export interface UpdateParrainageDemandeRequest {
    id: number
    detailsParrainage?: string
    parrain?: User
    demande?: Demande
}

export const listParrainageDemandeValidation = Joi.object<ListParrainageDemandeRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    detailsParrainage: Joi.string().optional(),
    parrain: Joi.number().optional(),
    demande: Joi.number().optional()
});

export interface ListParrainageDemandeRequest {
    page: number
    limit: number
    detailsParrainage?: string
    parrain?: number
    demande?: number
}
