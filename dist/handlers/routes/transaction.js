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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionHandler = void 0;
const database_1 = require("../../database/database");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const transaction_validator_1 = require("../validators/transaction-validator");
const transaction_usecase_1 = require("../../domain/transaction-usecase");
const transaction_1 = require("../../database/entities/transaction");
const stripe_1 = __importDefault(require("stripe"));
const TransactionHandler = (app) => {
    app.get("/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = transaction_validator_1.listTransactionValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listTransactionRequest = validation.value;
        let limit = 20;
        if (listTransactionRequest.limit) {
            limit = listTransactionRequest.limit;
        }
        const page = (_a = listTransactionRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const transactionUsecase = new transaction_usecase_1.TransactionUsecase(database_1.AppDataSource);
            const listTransactions = yield transactionUsecase.listTransactions(Object.assign(Object.assign({}, listTransactionRequest), { page, limit }));
            res.status(200).send(listTransactions);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });
    app.post("/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = transaction_validator_1.createTransactionValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const transactionRequest = validation.value;
        const transactionRepo = database_1.AppDataSource.getRepository(transaction_1.Transaction);
        const amountInCents = Math.round(transactionRequest.montant * 100);
        if (amountInCents < 50) { // 0.50 EUR minimum en centimes
            return res.status(400).send({ error: 'Amount must be at least €0.50 eur' });
        }
        try {
            const paymentIntent = yield stripe.paymentIntents.create({
                amount: amountInCents,
                currency: 'eur',
                payment_method: transactionRequest.methodePaiement, // Assurez-vous que ce champ est envoyé dans le corps de la requête
                confirm: true,
                return_url: 'http://localhost:5173/don', // Remplacez par votre URL de retour
            });
            const transactionCreated = yield transactionRepo.save(transactionRequest);
            res.status(201).send({ transactionCréé: transactionCreated, clientSecret: paymentIntent.client_secret });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/transactions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = transaction_validator_1.transactionIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const transactionId = validationResult.value;
            const transactionRepository = database_1.AppDataSource.getRepository(transaction_1.Transaction);
            const transaction = yield transactionRepository.findOneBy({ id: transactionId.id });
            if (transaction === null) {
                res.status(404).send({ "error": `Transaction ${transactionId.id} not found` });
                return;
            }
            yield transactionRepository.remove(transaction);
            res.status(200).send("Transaction supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/transactions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = transaction_validator_1.transactionIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const transactionId = validationResult.value;
            const transactionUsecase = new transaction_usecase_1.TransactionUsecase(database_1.AppDataSource);
            const transaction = yield transactionUsecase.getOneTransaction(transactionId.id);
            if (transaction === null) {
                res.status(404).send({ "error": `Transaction ${transactionId.id} not found` });
                return;
            }
            res.status(200).send(transaction);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/transactions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = transaction_validator_1.updateTransactionValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateTransactionRequest = validation.value;
        try {
            const transactionUsecase = new transaction_usecase_1.TransactionUsecase(database_1.AppDataSource);
            const validationResult = transaction_validator_1.transactionIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedTransaction = yield transactionUsecase.updateTransaction(updateTransactionRequest.id, Object.assign({}, updateTransactionRequest));
            if (updatedTransaction === null) {
                res.status(404).send({ "error": `Transaction ${updateTransactionRequest.id} not found` });
                return;
            }
            if (updatedTransaction === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedTransaction);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.TransactionHandler = TransactionHandler;
