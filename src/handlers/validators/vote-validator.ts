import Joi from "joi";
import { Proposition } from "../../database/entities/proposition";
import { User } from "../../database/entities/user";

export const createVoteValidation = Joi.object<CreateVoteValidationRequest>({
    choix: Joi.string().max(255).required(),
    proposition: Joi.number().required(),
    user: Joi.number().required()
}).options({ abortEarly: false });

export interface CreateVoteValidationRequest {
    choix: string
    proposition: Proposition
    user: User
}

export const voteIdValidation = Joi.object<VoteIdRequest>({
    id: Joi.number().required(),
});

export interface VoteIdRequest {
    id: number
}

export const updateVoteValidation = Joi.object<UpdateVoteRequest>({
    id: Joi.number().required(),
    choix: Joi.string().max(255).optional(),
    proposition: Joi.number().optional(),
    user: Joi.number().optional()
});

export interface UpdateVoteRequest {
    id: number
    choix?: string
    proposition?: Proposition
    user?: User
}

export const listVoteValidation = Joi.object<ListVoteRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    choix: Joi.string().optional(),
    proposition: Joi.number().optional(),
    user: Joi.number().optional()
});

export interface ListVoteRequest {
    page: number
    limit: number
    choix?: string
    proposition?: number
    user?: number
}
