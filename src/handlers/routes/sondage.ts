import express, { Request, Response } from 'express';
import { AppDataSource } from "../../database/database";
import { Sondage } from "../../database/entities/sondage";
import { SondageUsecase } from "../../domain/sondage-usecase";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";
import { listSondageValidation, createSondageValidation, sondageIdValidation, updateSondageValidation } from "../validators/sondage-validator";

export const SondageHandler = (app: express.Express) => {
    app.get("/sondages", async (req: Request, res: Response) => {
        const validation = listSondageValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listSondageRequest = validation.value;
        let limit = 20;
        if (listSondageRequest.limit) {
            limit = listSondageRequest.limit;
        }
        const page = listSondageRequest.page ?? 1;

        try {
            const sondageUsecase = new SondageUsecase(AppDataSource);
            const listSondages = await sondageUsecase.listSondages({ ...listSondageRequest, page, limit });
            res.status(200).send(listSondages);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/sondages", async (req: Request, res: Response) => {
        const validation = createSondageValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const sondageRequest = validation.value;

        const sondageRepo = AppDataSource.getRepository(Sondage);

        try {
            const sondageCreated = await sondageRepo.save(sondageRequest);
            res.status(201).send(sondageCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/sondages/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = sondageIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const sondageId = validationResult.value;

            const sondageRepository = AppDataSource.getRepository(Sondage);
            const sondage = await sondageRepository.findOneBy({ id: sondageId.id });
            if (sondage === null) {
                res.status(404).send({ "error": `Sondage ${sondageId.id} not found` });
                return;
            }

            await sondageRepository.remove(sondage);
            res.status(200).send("Sondage supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/sondages/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = sondageIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const sondageId = validationResult.value;

            const sondageUsecase = new SondageUsecase(AppDataSource);
            const sondage = await sondageUsecase.getOneSondage(sondageId.id);
            if (sondage === null) {
                res.status(404).send({ "error": `Sondage ${sondageId.id} not found` });
                return;
            }
            res.status(200).send(sondage);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/sondages/:id", async (req: Request, res: Response) => {
        const validation = updateSondageValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateSondageRequest = validation.value;

        try {
            const sondageUsecase = new SondageUsecase(AppDataSource);

            const validationResult = sondageIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedSondage = await sondageUsecase.updateSondage(
                updateSondageRequest.id,
                { ...updateSondageRequest }
            );

            if (updatedSondage === null) {
                res.status(404).send({ "error": `Sondage ${updateSondageRequest.id} not found` });
                return;
            }

            if (updatedSondage === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedSondage);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};