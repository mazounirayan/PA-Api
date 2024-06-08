import Joi from "joi";

export const createAideProjetValidation = Joi.object<CreateAideProjetValidationRequest>({
    nom: Joi.string().required(),
    descriptionProjet: Joi.string().required(),
    budget: Joi.number().required(),
    deadline: Joi.date().required()
}).options({ abortEarly: false });

export interface CreateAideProjetValidationRequest {
    nom: string
    descriptionProjet: string
    budget: number
    deadline: Date
}

export const aideProjetIdValidation = Joi.object<AideProjetIdRequest>({
    id: Joi.number().required(),
});

export interface AideProjetIdRequest {
    id: number
}

export const updateAideProjetValidation = Joi.object<UpdateAideProjetRequest>({
    id: Joi.number().required(),
    nom: Joi.string().optional(),
    descriptionProjet: Joi.string().optional(),
    budget: Joi.number().optional(),
    deadline: Joi.date().optional()
});

export interface UpdateAideProjetRequest {
    id: number
    nom?: string
    descriptionProjet?: string
    budget?: number
    deadline?: Date
}

export const listAideProjetValidation = Joi.object<ListAideProjetRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
    descriptionProjet: Joi.string().optional(),
    budget: Joi.number().optional(),
    deadline: Joi.date().optional()
});

export interface ListAideProjetRequest {
    page: number
    limit: number
    nom?: string
    descriptionProjet?: string
    budget?: number
    deadline?: Date
}
