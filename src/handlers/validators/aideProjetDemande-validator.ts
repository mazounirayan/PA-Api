import Joi from "joi";
import { Demande } from "../../database/entities/demande";

export const createAideProjetDemandeValidation = Joi.object<CreateAideProjetDemandeValidationRequest>({
    titre: Joi.string().required(),
    descriptionProjet: Joi.string().required(),
    budget: Joi.number().required(),
    deadline: Joi.date().required(),
    demande: Joi.number().required()
}).options({ abortEarly: false })

export interface CreateAideProjetDemandeValidationRequest {
    titre: string
    descriptionProjet: string
    budget: number
    deadline: Date
    demande: Demande
}

export const aideProjetDemandeIdValidation = Joi.object<AideProjetDemandeIdRequest>({
    id: Joi.number().required(),
});

export interface AideProjetDemandeIdRequest {
    id: number
}

export const updateAideProjetDemandeValidation = Joi.object<UpdateAideProjetDemandeRequest>({
    id: Joi.number().required(),
    titre: Joi.string().optional(),
    descriptionProjet: Joi.string().optional(),
    budget: Joi.number().optional(),
    deadline: Joi.date().optional(),
    demande: Joi.number().optional()
});

export interface UpdateAideProjetDemandeRequest {
    id: number
    titre?: string
    descriptionProjet?: string
    budget?: number
    deadline?: Date
    demande?: Demande
}

export const listAideProjetDemandeValidation = Joi.object<ListAideProjetDemandeRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    titre: Joi.string().optional(),
    descriptionProjet: Joi.string().optional(),
    budget: Joi.number().optional(),
    deadline: Joi.date().optional(),
    demande: Joi.number().optional()
});

export interface ListAideProjetDemandeRequest {
    page: number
    limit: number
    titre?: string
    descriptionProjet?: string
    budget?: number
    deadline?: Date
    demande?: number
}
