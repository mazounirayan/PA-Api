import Joi from "joi";
import { TypeRessource, TypeStatut } from "../../database/entities/ressource";

export const createRessourceValidation = Joi.object<CreateRessourceValidationRequest>({
    nom: Joi.string().required(),
    type: Joi.string().valid('Salle', 'Matériel', 'Alimentaire').required(),
    statut: Joi.string().valid('Disponible', 'Réservé').required(),
    emplacement: Joi.string().required()
});

export interface CreateRessourceValidationRequest {
    nom: string
    type: TypeRessource;
    statut: TypeStatut;
    emplacement: string
}

export const ressourceIdValidation = Joi.object<RessourceIdRequest>({
    id: Joi.number().required(),
})

export interface RessourceIdRequest {
    id: number
}

export const updateRessourceValidation = Joi.object<UpdateRessourceRequest>({
    id: Joi.number().required(),
    nom: Joi.string().optional(),
    type: Joi.string().valid('Salle', 'Matériel', 'Alimentaire').optional(),
    statut: Joi.string().valid('Disponible', 'Réservé').optional(),
    emplacement: Joi.string().optional(),
})

export interface UpdateRessourceRequest {
    id: number
    nom?: string
    type?: TypeRessource;
    statut?: TypeStatut;
    emplacement?: string
}
export const listRessourceValidation = Joi.object<ListRessourceRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
    type: Joi.string().optional(),
    statut: Joi.string().optional(),
    emplacement: Joi.string().optional()
})

export interface ListRessourceRequest {
    page: number
    limit: number
    nom?: string
    type?: string;
    statut?: string;
    emplacement?: string
}
