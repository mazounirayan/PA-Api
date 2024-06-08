import Joi from "joi";
import { TypeProposition } from "../../database/entities/proposition";
import { Ag } from "../../database/entities/ag";
import { Sondage } from "../../database/entities/sondage";

export const createPropositionValidation = Joi.object<CreatePropositionValidationRequest>({
    description: Joi.string().required(),
    type: Joi.string().valid(...Object.values(TypeProposition)).required(),
    ag: Joi.number().optional(),
    sondage: Joi.number().optional()
}).options({ abortEarly: false });

export interface CreatePropositionValidationRequest {
    description: string
    type: TypeProposition
    ag?: Ag
    sondage?: Sondage
}

export const propositionIdValidation = Joi.object<PropositionIdRequest>({
    id: Joi.number().required(),
});

export interface PropositionIdRequest {
    id: number
}

export const updatePropositionValidation = Joi.object<UpdatePropositionRequest>({
    id: Joi.number().required(),
    description: Joi.string().optional(),
    type: Joi.string().valid(...Object.values(TypeProposition)).optional(),
    ag: Joi.number().optional(),
    sondage: Joi.number().optional()
});

export interface UpdatePropositionRequest {
    id: number
    description?: string
    type?: TypeProposition
    ag?: Ag
    sondage?: Sondage
}

export const listPropositionValidation = Joi.object<ListPropositionRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    description: Joi.string().optional(),
    type: Joi.string().valid(...Object.values(TypeProposition)).optional(),
    ag: Joi.number().optional(),
    sondage: Joi.number().optional()
});

export interface ListPropositionRequest {
    page: number
    limit: number
    description?: string
    type?: TypeProposition
    ag?: number
    sondage?: number
}
