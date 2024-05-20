import express, { Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Evenement } from '../../database/entities/evenement';
import { EvenementUsecase } from '../../domain/evenement-usecase';
import { listEvenementValidation, createEvenementValidation, evenementIdValidation, updateEvenementValidation } from '../validators/evenement-validator';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';


export const EvenementHandler = (app: express.Express) => {
    app.get("/evenements", async (req: Request, res: Response) => {
        const validation = listEvenementValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listEvenementRequest = validation.value;
        let limit = 20;
        if (listEvenementRequest.limit) {
            limit = listEvenementRequest.limit;
        }
        const page = listEvenementRequest.page ?? 1;

        try {
            const evenementUsecase = new EvenementUsecase(AppDataSource);
            const listEvenements = await evenementUsecase.listEvenements({ ...listEvenementRequest, page, limit });
            res.status(200).send(listEvenements);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/evenements", async (req: Request, res: Response) => {
        const validation = createEvenementValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const evenementRequest = validation.value;

        const evenementRepo = AppDataSource.getRepository(Evenement);

        try {
            const evenementCreated = await evenementRepo.save(evenementRequest);
            res.status(201).send(evenementCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/evenements/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = evenementIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const evenementId = validationResult.value;

            const evenementRepository = AppDataSource.getRepository(Evenement);
            const evenement = await evenementRepository.findOneBy({ id: evenementId.id });
            if (evenement === null) {
                res.status(404).send({ "error": `Evenement ${evenementId.id} not found` });
                return;
            }

            await evenementRepository.remove(evenement);
            res.status(200).send("Evenement supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/evenements/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = evenementIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const evenementId = validationResult.value;

            const evenementUsecase = new EvenementUsecase(AppDataSource);
            const evenement = await evenementUsecase.getOneEvenement(evenementId.id);
            if (evenement === null) {
                res.status(404).send({ "error": `Evenement ${evenementId.id} not found` });
                return;
            }
            res.status(200).send(evenement);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/evenements/:id", async (req: Request, res: Response) => {
        const validation = updateEvenementValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateEvenementRequest = validation.value;

        try {
            const evenementUsecase = new EvenementUsecase(AppDataSource);

            const validationResult = evenementIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedEvenement = await evenementUsecase.updateEvenement(
                updateEvenementRequest.id,
                { ...updateEvenementRequest }
            );

            if (updatedEvenement === null) {
                res.status(404).send({ "error": `Evenement ${updateEvenementRequest.id} not found` });
                return;
            }

            if (updatedEvenement === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedEvenement);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
