import Joi from "joi";
import { Ag } from "../../database/entities/ag";
import { User } from "../../database/entities/user";

export const createParticipationAGValidation = Joi.object<CreateParticipationAGValidationRequest>({
    user: Joi.number().required(),
    ag: Joi.number().required()
}).options({ abortEarly: false });

export interface CreateParticipationAGValidationRequest {
    user: User
    ag: Ag
}

export const participationAGIdValidation = Joi.object<ParticipationAGIdRequest>({
    id: Joi.number().required(),
});

export interface ParticipationAGIdRequest {
    id: number
}

export const updateParticipationAGValidation = Joi.object<UpdateParticipationAGRequest>({
    id: Joi.number().required(),
    user: Joi.number().optional(),
    ag: Joi.number().optional()
});

export interface UpdateParticipationAGRequest {
    id: number
    user?: User
    ag?: Ag
}

export const listParticipationAGValidation = Joi.object<ListParticipationAGRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    user: Joi.number().optional(),
    ag: Joi.number().optional()
});

export interface ListParticipationAGRequest {
    page: number
    limit: number
    user?: number
    ag?: number
}
