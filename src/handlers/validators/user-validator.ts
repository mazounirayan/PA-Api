import Joi from "joi";
import { User, UserRole } from "../../database/entities/user";

export const createUserValidation = Joi.object<CreateUserValidationRequest>({
    nom: Joi.string().max(100).required(),
    prenom: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    motDePasse: Joi.string().min(8).optional(),
    role: Joi.string().valid('Visiteur', 'Administrateur', 'Adherent').required(),
    estBenevole: Joi.boolean().optional(),
    parrain: Joi.number().integer().positive().allow(null).optional(),
}).options({ abortEarly: false });


export interface CreateUserValidationRequest {
    nom: string;
    prenom: string;
    email: string;
    motDePasse?: string;
    role: UserRole;
    estBenevole?: boolean;
    parrain?: User;
}



export const LoginUserValidation = Joi.object<LoginUserValidationRequest>({
    email: Joi.string().email().required(),
    motDePasse: Joi.string().required(),
}).options({ abortEarly: false });

export interface LoginUserValidationRequest {
    email: string
    motDePasse: string
}


export const listUserValidation = Joi.object<ListUserRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
})

export interface ListUserRequest {
    page?: number
    limit?: number
}



export const updateUserValidation = Joi.object<UpdateUserRequest>({
    id: Joi.number().required(),
    nom: Joi.string().max(100).optional(),
    prenom: Joi.string().max(100).optional(),
    email: Joi.string().email().optional(),
    motDePasse: Joi.string().min(8).optional(),
    role: Joi.string().valid('Visiteur', 'Administrateur', 'Adherent').optional(),
    estBenevole: Joi.boolean().optional(),
    parrain: Joi.number().integer().positive().allow(null).optional()
})

export interface UpdateUserRequest {
    id: number
    nom?: string;
    prenom?: string;
    email?: string;
    motDePasse?: string;
    role?: UserRole;
    estBenevole?: boolean;
    parrain?: User;
}

