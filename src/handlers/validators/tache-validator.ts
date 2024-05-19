import Joi from "joi";
import { Ressource} from "../../database/entities/ressource";
import { User } from "../../database/entities/user";
import { StatutTache } from "../../database/entities/tache";

export const createTacheValidation = Joi.object<CreateTacheValidationRequest>({
    dateDebut: Joi.date().required(),
    dateFin: Joi.date().required(),
    description: Joi.string().required(),
    responsable: Joi.number().required(),
    statut: Joi.string().valid('Fini', 'En cours').required(),
});

export interface CreateTacheValidationRequest {
    description: string
    dateDebut: Date;
    dateFin: Date;
    responsable: User
    statut: StatutTache;
}

export const tacheIdValidation = Joi.object<TacheIdRequest>({
    id: Joi.number().required(),
})

export interface TacheIdRequest {
    id: number
}

export const updateTacheValidation = Joi.object<UpdateTacheRequest>({
    id: Joi.number().required(),
    dateDebut: Joi.date().optional(),
    dateFin: Joi.date().optional(),
    description: Joi.string().optional(),
    responsable: Joi.number().optional(),
    statut: Joi.string().valid('Fini', 'En cours').optional(),
})

export interface UpdateTacheRequest {
    id: number
    description?: string
    dateDebut?: Date;
    dateFin?: Date;
    statut?: StatutTache;
    responsable?: User
}
export const listTacheValidation = Joi.object<ListTacheRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    dateDebut: Joi.date().optional(),
    dateFin: Joi.date().optional(),
    description: Joi.string().optional(),
    responsable: Joi.number().optional(),
    statut: Joi.string().valid('Fini', 'En cours').optional(),
})

export interface ListTacheRequest {
    page: number
    limit: number
    description?: string
    dateDebut?: Date;
    dateFin?: Date;
    statut?: StatutTache;
    responsable?: number
}
