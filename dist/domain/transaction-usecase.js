"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionUsecase = void 0;
const transaction_1 = require("../database/entities/transaction");
class TransactionUsecase {
    constructor(db) {
        this.db = db;
    }
    listTransactions(listTransactionRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(transaction_1.Transaction, 'transaction');
            if (listTransactionRequest.emailVisiteur) {
                query.andWhere("transaction.emailVisiteur = :emailVisiteur", { emailVisiteur: listTransactionRequest.emailVisiteur });
            }
            if (listTransactionRequest.evenement) {
                query.andWhere("transaction.evenementId = :evenement", { evenement: listTransactionRequest.evenement });
            }
            if (listTransactionRequest.montant) {
                query.andWhere("transaction.montant = :montant", { montant: listTransactionRequest.montant });
            }
            if (listTransactionRequest.methodePaiement) {
                query.andWhere("transaction.methodePaiement = :methodePaiement", { methodePaiement: listTransactionRequest.methodePaiement });
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
            const [Transactions, totalCount] = yield query.getManyAndCount();
            return {
                Transactions,
                totalCount
            };
        });
    }
    getOneTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(transaction_1.Transaction, 'transaction')
                .leftJoinAndSelect('transaction.evenement', 'evenement')
                .where("transaction.id = :id", { id: id });
            const transaction = yield query.getOne();
            if (!transaction) {
                console.log({ error: `Transaction ${id} not found` });
                return null;
            }
            return transaction;
        });
    }
    updateTransaction(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { emailVisiteur, evenement, montant, methodePaiement, type, dateTransaction }) {
            const repo = this.db.getRepository(transaction_1.Transaction);
            const transactionFound = yield repo.findOneBy({ id });
            if (transactionFound === null)
                return null;
            if (emailVisiteur === undefined && evenement === undefined && montant === undefined && methodePaiement === undefined && type === undefined && dateTransaction === undefined) {
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
            if (methodePaiement) {
                transactionFound.methodePaiement = methodePaiement;
            }
            if (type) {
                transactionFound.type = type;
            }
            if (dateTransaction) {
                transactionFound.dateTransaction = dateTransaction;
            }
            const transactionUpdate = yield repo.save(transactionFound);
            return transactionUpdate;
        });
    }
}
exports.TransactionUsecase = TransactionUsecase;
