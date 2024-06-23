import { DataSource } from "typeorm";
import { Transaction, TypeTransaction } from "../database/entities/transaction";
import { Evenement } from "../database/entities/evenement";
import { Visiteur } from "../database/entities/visiteur";

export interface ListTransactionRequest {
    page: number
    limit: number
    emailVisiteur?: string
    evenement?: number
    montant?: number
    type?: TypeTransaction
    dateTransaction?: Date
}

export interface UpdateTransactionParams {
    emailVisiteur?: string
    evenement?: Evenement
    montant?: number
    type?: TypeTransaction
    dateTransaction?: Date
}

export class TransactionUsecase {
    constructor(private readonly db: DataSource) { }

    async listTransactions(listTransactionRequest: ListTransactionRequest): Promise<{ Transactions: Transaction[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Transaction, 'transaction');
        if (listTransactionRequest.emailVisiteur) {
            query.andWhere("transaction.emailVisiteur = :emailVisiteur", { emailVisiteur: listTransactionRequest.emailVisiteur });
        }

        if (listTransactionRequest.evenement) {
            query.andWhere("transaction.evenementId = :evenement", { evenement: listTransactionRequest.evenement });
        }

        if (listTransactionRequest.montant) {
            query.andWhere("transaction.montant = :montant", { montant: listTransactionRequest.montant });
        }

        if (listTransactionRequest.type) {
            query.andWhere("transaction.type = :type", { type: listTransactionRequest.type });
        }

        if (listTransactionRequest.dateTransaction) {
            query.andWhere("transaction.dateTransaction = :dateTransaction", { dateTransaction: listTransactionRequest.dateTransaction });
        }

        query.leftJoinAndSelect('transaction.evenement', 'evenement')
            .skip((listTransactionRequest.page - 1) * listTransactionRequest.limit)
            .take(listTransactionRequest.limit);

        const [Transactions, totalCount] = await query.getManyAndCount();
        return {
            Transactions,
            totalCount
        };
    }

    async getOneTransaction(id: number): Promise<Transaction | null> {
        const query = this.db.createQueryBuilder(Transaction, 'transaction')
            .leftJoinAndSelect('transaction.evenement', 'evenement')
            .where("transaction.id = :id", { id: id });

        const transaction = await query.getOne();

        if (!transaction) {
            console.log({ error: `Transaction ${id} not found` });
            return null;
        }
        return transaction;
    }

    async updateTransaction(id: number, { emailVisiteur, evenement, montant, type, dateTransaction }: UpdateTransactionParams): Promise<Transaction | string | null> {
        const repo = this.db.getRepository(Transaction);
        const transactionFound = await repo.findOneBy({ id });
        if (transactionFound === null) return null;

        if (emailVisiteur === undefined && evenement === undefined && montant === undefined && type === undefined && dateTransaction === undefined) {
            return "No changes";
        }

        if (emailVisiteur) {
            transactionFound.emailVisiteur = emailVisiteur;
        }
        if (evenement) {
            transactionFound.evenement = evenement;
        }
        if (montant !== undefined) {
            transactionFound.montant = montant;
        }
        if (type) {
            transactionFound.type = type;
        }
        if (dateTransaction) {
            transactionFound.dateTransaction = dateTransaction;
        }

        const transactionUpdate = await repo.save(transactionFound);
        return transactionUpdate;
    }
}