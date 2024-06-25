import Joi from "joi";
import { Evenement } from "../../database/entities/evenement";
import { TypeTransaction } from "../../database/entities/transaction";

export const createTransactionValidation = Joi.object<CreateTransactionValidationRequest>({
    emailVisiteur: Joi.string().email().required(),
    evenement: Joi.number().optional(),
    montant: Joi.number().required(),
    type: Joi.string().valid(...Object.values(TypeTransaction)).required(),
}).options({ abortEarly: false })

export interface CreateTransactionValidationRequest {
    emailVisiteur: string
    evenement?: Evenement
    montant: number
    type: TypeTransaction
}

export const transactionIdValidation = Joi.object<TransactionIdRequest>({
    id: Joi.number().required(),
});

export interface TransactionIdRequest {
    id: number
}

export const updateTransactionValidation = Joi.object<UpdateTransactionRequest>({
    id: Joi.number().required(),
    emailVisiteur: Joi.string().email().optional(),
    evenement: Joi.number().optional(),
    montant: Joi.number().optional(),
    type: Joi.string().valid(...Object.values(TypeTransaction)).optional(),
});

export interface UpdateTransactionRequest {
    id: number
    emailVisiteur?: string
    evenement?: Evenement
    montant?: number
    type?: TypeTransaction
}

export const listTransactionValidation = Joi.object<ListTransactionRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    emailVisiteur: Joi.string().email().optional(),
    evenement: Joi.number().optional(),
    montant: Joi.number().optional(),
    type: Joi.string().valid(...Object.values(TypeTransaction)).optional(),
    dateTransaction: Joi.date().optional()
});

export interface ListTransactionRequest {
    page: number
    limit: number
    emailVisiteur?: string
    evenement?: number
    montant?: number
    type?: TypeTransaction
    dateTransaction?: Date
}