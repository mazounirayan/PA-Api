import express, { Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { EvenementRessource } from '../../database/entities/evenementRessource';
import { EvenementRessourceUsecase } from '../../domain/evenementRessource-usecase';
import { listEvenementRessourceValidation, createEvenementRessourceValidation, evenementRessourceIdValidation, updateEvenementRessourceValidation } from '../validators/evenementRessource-validator';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';

export const EvenementRessourceHandler = (app: express.Express) => {
    app.get("/evenement-ressources", async (req: Request, res: Response) => {
        const validation = listEvenementRessourceValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listEvenementRessourceRequest = validation.value;
        let limit = 20;
        if (listEvenementRessourceRequest.limit) {
            limit = listEvenementRessourceRequest.limit;
        }
        const page = listEvenementRessourceRequest.page ?? 1;

        try {
            const evenementRessourceUsecase = new EvenementRessourceUsecase(AppDataSource);
            const listEvenementRessources = await evenementRessourceUsecase.listEvenementRessources({ ...listEvenementRessourceRequest, page, limit });
            res.status(200).send(listEvenementRessources);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/evenement-ressources", async (req: Request, res: Response) => {
        const validation = createEvenementRessourceValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const evenementRessourceRequest = validation.value;

        const evenementRessourceRepo = AppDataSource.getRepository(EvenementRessource);

        try {
            const evenementRessourceCreated = await evenementRessourceRepo.save(evenementRessourceRequest);
            res.status(201).send(evenementRessourceCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/evenement-ressources/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = evenementRessourceIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const evenementRessourceId = validationResult.value;

            const evenementRessourceRepository = AppDataSource.getRepository(EvenementRessource);
            const evenementRessource = await evenementRessourceRepository.findOneBy({ id: evenementRessourceId.id });
            if (evenementRessource === null) {
                res.status(404).send({ "error": `EvenementRessource ${evenementRessourceId.id} not found` });
                return;
            }

            await evenementRessourceRepository.remove(evenementRessource);
            res.status(200).send("EvenementRessource supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/evenement-ressources/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = evenementRessourceIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const evenementRessourceId = validationResult.value;

            const evenementRessourceUsecase = new EvenementRessourceUsecase(AppDataSource);
            const evenementRessource = await evenementRessourceUsecase.getOneEvenementRessource(evenementRessourceId.id);
            if (evenementRessource === null) {
                res.status(404).send({ "error": `EvenementRessource ${evenementRessourceId.id} not found` });
                return;
            }
            res.status(200).send(evenementRessource);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/evenement-ressources/:id", async (req: Request, res: Response) => {
        const validation = updateEvenementRessourceValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateEvenementRessourceRequest = validation.value;

        try {
            const evenementRessourceUsecase = new EvenementRessourceUsecase(AppDataSource);

            const validationResult = evenementRessourceIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedEvenementRessource = await evenementRessourceUsecase.updateEvenementRessource(
                updateEvenementRessourceRequest.id,
                { ...updateEvenementRessourceRequest }
            );

            if (updatedEvenementRessource === null) {
                res.status(404).send({ "error": `EvenementRessource ${updateEvenementRessourceRequest.id} not found` });
                return;
            }

            if (updatedEvenementRessource === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedEvenementRessource);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
