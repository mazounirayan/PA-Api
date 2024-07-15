import Joi from "joi";
import { TypeRessource } from "../../database/entities/ressource";

export const createRessourceValidation = Joi.object<CreateRessourceValidationRequest>({
    nom: Joi.string().required(),
    type: Joi.string().valid(...Object.values(TypeRessource)).required(),
    quantite: Joi.number().required(),
    emplacement: Joi.string().required()
});

export interface CreateRessourceValidationRequest {
    nom: string
    type: TypeRessource
    quantite: number
    emplacement: string
}

export const ressourceIdValidation = Joi.object<RessourceIdRequest>({
    id: Joi.number().required(),
});

export interface RessourceIdRequest {
    id: number
}

export const updateRessourceValidation = Joi.object<UpdateRessourceRequest>({
    id: Joi.number().required(),
    nom: Joi.string().optional(),
    type: Joi.string().valid(...Object.values(TypeRessource)).optional(),
    quantite: Joi.number().optional(),
    emplacement: Joi.string().optional()
});

export interface UpdateRessourceRequest {
    id: number
    nom?: string
    type?: TypeRessource
    quantite?: number
    emplacement?: string
}

export const listRessourceValidation = Joi.object<ListRessourceRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
    type: Joi.string().valid(...Object.values(TypeRessource)).optional(),
    quantite: Joi.number().optional(),
    emplacement: Joi.string().optional()
});

export interface ListRessourceRequest {
    page: number
    limit: number
    nom?: string
    type?: TypeRessource
    quantite?: number
    emplacement?: string
}
