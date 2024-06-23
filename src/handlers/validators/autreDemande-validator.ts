import Joi from "joi";
import { Demande } from "../../database/entities/demande";

export const createAutreDemandeValidation = Joi.object<CreateAutreDemandeValidationRequest>({
    titre: Joi.string().required(),
    description: Joi.string().required(),
    demande: Joi.number().required()
}).options({ abortEarly: false })

export interface CreateAutreDemandeValidationRequest {
    titre: string
    description: string
    demande: Demande
}

export const autreDemandeIdValidation = Joi.object<AutreDemandeIdRequest>({
    id: Joi.number().required(),
});

export interface AutreDemandeIdRequest {
    id: number
}

export const updateAutreDemandeValidation = Joi.object<UpdateAutreDemandeRequest>({
    id: Joi.number().required(),
    titre: Joi.string().optional(),
    description: Joi.string().optional(),
    demande: Joi.number().optional()
});

export interface UpdateAutreDemandeRequest {
    id: number
    titre?: string
    description?: string
    demande?: Demande
}

export const listAutreDemandeValidation = Joi.object<ListAutreDemandeRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    titre: Joi.string().optional(),
    description: Joi.string().optional(),
    demande: Joi.number().optional()
});

export interface ListAutreDemandeRequest {
    page: number
    limit: number
    titre?: string
    description?: string
    demande?: number
}
