import Joi from "joi";
import { Ressource} from "../../database/entities/ressource";
import { User } from "../../database/entities/user";

export const createReservationValidation = Joi.object<CreateReservationValidationRequest>({
    dateDebut: Joi.date().required(),
    dateFin: Joi.date().required(),
    description: Joi.string().required(),
    ressource: Joi.number().required(),
    user: Joi.number().required()
}).options({ abortEarly: false })

export interface CreateReservationValidationRequest {
    dateDebut: Date;
    dateFin: Date;
    description: string
    ressource: Ressource
    user: User
}

export const reservationIdValidation = Joi.object<ReservationIdRequest>({
    id: Joi.number().required(),
})

export interface ReservationIdRequest {
    id: number
}

export const updateReservationValidation = Joi.object<UpdateReservationRequest>({
    id: Joi.number().required(),
    dateDebut: Joi.date().optional(),
    dateFin: Joi.date().optional(),
    description: Joi.string().optional(),
    ressource: Joi.number().optional(),
    user: Joi.number().optional()
})

export interface UpdateReservationRequest {
    id: number
    dateDebut?: Date;
    dateFin?: Date;
    description?: string
    ressource?: Ressource
    user?: User
}
export const listReservationValidation = Joi.object<ListReservationRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    dateDebut: Joi.date().optional(),
    dateFin: Joi.date().optional(),
    description: Joi.string().optional(),
    ressource: Joi.number().optional(),
    user: Joi.number().optional()
})

export interface ListReservationRequest {
    page: number
    limit: number
    dateDebut?: Date;
    dateFin?: Date;
    description?: string
    ressource?: number
    user?: number
}
