import Joi from "joi";
import { User } from "../../database/entities/user";
import { Evenement } from "../../database/entities/evenement";
import { TypeTransaction } from "../../database/entities/transaction";
import { Visiteur } from "../../database/entities/visiteur";

export const createTransactionValidation = Joi.object<CreateTransactionValidationRequest>({
    montant: Joi.number().required(),
    type: Joi.string().valid('Don', 'Cotisation', 'Paiement evenement', 'Inscription').required(),
    dateTransaction: Joi.date().optional(),
    visiteur: Joi.number().required(),
    evenement: Joi.number().optional()
}).options({ abortEarly: false })

export interface CreateTransactionValidationRequest {
    montant: number
    type: TypeTransaction
    dateTransaction?: Date
    visiteur: Visiteur
    evenement: Evenement
}

export const transactionIdValidation = Joi.object<TransactionIdRequest>({
    id: Joi.number().required(),
});

export interface TransactionIdRequest {
    id: number
}

export const updateTransactionValidation = Joi.object<UpdateTransactionRequest>({
    id: Joi.number().required(),
    montant: Joi.number().optional(),
    type: Joi.string().valid('Don', 'Cotisation', 'Paiement evenement', 'Inscription').optional(),
    date: Joi.date().optional(),
    visiteur: Joi.number().optional(),
    evenement: Joi.number().optional()
});

export interface UpdateTransactionRequest {
    id: number
    montant?: number
    type?: TypeTransaction
    date?: Date
    visiteur?: Visiteur
    evenement?: Evenement
}

export const listTransactionValidation = Joi.object<ListTransactionRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    montant: Joi.number().optional(),
    type: Joi.string().valid('Don', 'Cotisation', 'Paiement evenement', 'Inscription').optional(),
    visiteur: Joi.number().optional(),
    evenement: Joi.number().optional()
});

export interface ListTransactionRequest {
    page: number
    limit: number
    montant?: number
    type?: TypeTransaction
    visiteur?: number
    evenement?: number
}
