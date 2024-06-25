import Joi from "joi";
import { Token } from "../../database/entities/token";
import { Dossier } from "../../database/entities/dossier";
import { User } from "../../database/entities/user";


export const createDossierValidation = Joi.object<CreateDossierValidationRequest>({
    nom: Joi.string().required(),
    token: Joi.number().optional(),
    dossier: Joi.number().optional(),
    user: Joi.number().required()
}).options({ abortEarly: false })

export interface CreateDossierValidationRequest {
    nom: string
    token: Token
    dossier?: Dossier
    user: User
}

export const dossierIdValidation = Joi.object<DossierIdRequest>({
    id: Joi.number().required(),
});

export interface DossierIdRequest {
    id: number
}

export const dossierUserIdValidation = Joi.object<DossierUserIdRequest>({
    dossierId: Joi.number().required(),
    id: Joi.number().required(),
    token: Joi.string().required()
});

export interface DossierUserIdRequest {
    dossierId: number
    id: number
    token: string
}

export const updateDossierValidation = Joi.object<UpdateDossierRequest>({
    id: Joi.number().required(),
    nom: Joi.string().optional(),
    token: Joi.number().optional(),
    dossier: Joi.number().optional(),
    user: Joi.number().optional()
});

export interface UpdateDossierRequest {
    id: number
    nom?: string
    token?: Token
    dossier?: Dossier
    user?: User
}

export const listDossierValidation = Joi.object<ListDossierRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
    token: Joi.number().optional(),
    dossier: Joi.number().optional(),
    user: Joi.number().optional()
});

export interface ListDossierRequest {
    page: number
    limit: number
    nom?: string
    token?: number
    dossier?: number
    user?: number
}
