import { DataSource } from "typeorm";
import { Transaction, TypeTransaction } from "../database/entities/transaction";
import { User } from "../database/entities/user";
import { Evenement } from "../database/entities/evenement";

export interface ListTransactionRequest {
    page: number
    limit: number
    montant?: number
    type?: string
    user?: number
    evenement?: number
}

export interface UpdateTransactionParams {
    montant?: number
    type?: TypeTransaction
    user?: User
    evenement?: Evenement
}

export class TransactionUsecase {
    constructor(private readonly db: DataSource) { }

    async listTransactions(listTransactionRequest: ListTransactionRequest): Promise<{ Transactions: Transaction[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Transaction, 'transaction');
        if (listTransactionRequest.montant) {
            query.andWhere("transaction.montant = :montant", { montant: listTransactionRequest.montant });
        }

        if (listTransactionRequest.type) {
            query.andWhere("transaction.type = :type", { type: listTransactionRequest.type });
        }

        if (listTransactionRequest.user) {
            query.andWhere("transaction.userId = :user", { user: listTransactionRequest.user });
        }

        if (listTransactionRequest.evenement) {
            query.andWhere("transaction.evenementId = :evenement", { evenement: listTransactionRequest.evenement });
        }

        query.leftJoinAndSelect('transaction.user', 'user')
            .leftJoinAndSelect('transaction.evenement', 'evenement')
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
            .leftJoinAndSelect('transaction.user', 'user')
            .leftJoinAndSelect('transaction.evenement', 'evenement')
            .where("transaction.id = :id", { id: id });

        const transaction = await query.getOne();

        if (!transaction) {
            console.log({ error: `Transaction ${id} not found` });
            return null;
        }
        return transaction;
    }

    async updateTransaction(id: number, { montant, type, user, evenement }: UpdateTransactionParams): Promise<Transaction | string | null> {
        const repo = this.db.getRepository(Transaction);
        const transactionFound = await repo.findOneBy({ id });
        if (transactionFound === null) return null;

        if (montant === undefined && type === undefined && user === undefined && evenement === undefined) {
            return "No changes";
        }

        if (montant) {
            transactionFound.montant = montant;
        }
        if (type) {
            transactionFound.type = type;
        }
        if (user) {
            transactionFound.user = user;
        }
        if (evenement) {
            transactionFound.evenement = evenement;
        }

        const transactionUpdate = await repo.save(transactionFound);
        return transactionUpdate;
    }
}
