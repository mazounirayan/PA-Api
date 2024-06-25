import express, { Request, Response } from 'express';
import { AppDataSource } from "../../database/database";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";

import { listTransactionValidation, createTransactionValidation, transactionIdValidation, updateTransactionValidation } from '../validators/transaction-validator';
import { TransactionUsecase } from '../../domain/transaction-usecase';
import { Transaction } from '../../database/entities/transaction';
import Stripe from 'stripe';

export const TransactionHandler = (app: express.Express) => {
    app.get("/transactions", async (req: Request, res: Response) => {
        const validation = listTransactionValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listTransactionRequest = validation.value;
        let limit = 20;
        if (listTransactionRequest.limit) {
            limit = listTransactionRequest.limit;
        }
        const page = listTransactionRequest.page ?? 1;

        try {
            const transactionUsecase = new TransactionUsecase(AppDataSource);
            const listTransactions = await transactionUsecase.listTransactions({ ...listTransactionRequest, page, limit });
            res.status(200).send(listTransactions);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });


    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });
    app.post("/transactions", async (req: Request, res: Response) => {
        const validation = createTransactionValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const transactionRequest = validation.value;
        const transactionRepo = AppDataSource.getRepository(Transaction);

        const amountInCents = Math.round(transactionRequest.montant * 100);

        if (amountInCents < 50) { // 0.50 EUR minimum en centimes
            return res.status(400).send({ error: 'Amount must be at least €0.50 eur' });
        }

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents,
                currency: 'eur',
                payment_method: transactionRequest.methodePaiement, // Assurez-vous que ce champ est envoyé dans le corps de la requête
                confirm: true,
                return_url: 'http://localhost:5173/don', // Remplacez par votre URL de retour
            });

            const transactionCreated = await transactionRepo.save(transactionRequest);
            res.status(201).send({ transactionCréé: transactionCreated, clientSecret: paymentIntent.client_secret });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/transactions/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = transactionIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const transactionId = validationResult.value;

            const transactionRepository = AppDataSource.getRepository(Transaction);
            const transaction = await transactionRepository.findOneBy({ id: transactionId.id });
            if (transaction === null) {
                res.status(404).send({ "error": `Transaction ${transactionId.id} not found` });
                return;
            }

            await transactionRepository.remove(transaction);
            res.status(200).send("Transaction supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/transactions/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = transactionIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const transactionId = validationResult.value;

            const transactionUsecase = new TransactionUsecase(AppDataSource);
            const transaction = await transactionUsecase.getOneTransaction(transactionId.id);
            if (transaction === null) {
                res.status(404).send({ "error": `Transaction ${transactionId.id} not found` });
                return;
            }
            res.status(200).send(transaction);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/transactions/:id", async (req: Request, res: Response) => {
        const validation = updateTransactionValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateTransactionRequest = validation.value;

        try {
            const transactionUsecase = new TransactionUsecase(AppDataSource);

            const validationResult = transactionIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedTransaction = await transactionUsecase.updateTransaction(
                updateTransactionRequest.id,
                { ...updateTransactionRequest }
            );

            if (updatedTransaction === null) {
                res.status(404).send({ "error": `Transaction ${updateTransactionRequest.id} not found` });
                return;
            }

            if (updatedTransaction === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedTransaction);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
