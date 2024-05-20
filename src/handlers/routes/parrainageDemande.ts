import express, { Request, Response } from 'express';
import { createParrainageDemandeValidation, updateParrainageDemandeValidation, parrainageDemandeIdValidation, listParrainageDemandeValidation } from '../validators/parrainageDemande-validator';
import { AppDataSource } from '../../database/database';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';
import { ParrainageDemande } from '../../database/entities/parrainageDemande';
import { ParrainageDemandeUsecase } from '../../domain/parrainageDemande-usecase';

export const ParrainageDemandeHandler = (app: express.Express) => {
    app.get("/parrainage-demandes", async (req: Request, res: Response) => {
        const validation = listParrainageDemandeValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listParrainageDemandeRequest = validation.value;
        let limit = 20;
        if (listParrainageDemandeRequest.limit) {
            limit = listParrainageDemandeRequest.limit;
        }
        const page = listParrainageDemandeRequest.page ?? 1;

        try {
            const parrainageDemandeUsecase = new ParrainageDemandeUsecase(AppDataSource);
            const listParrainageDemandes = await parrainageDemandeUsecase.listParrainageDemandes({ ...listParrainageDemandeRequest, page, limit });
            res.status(200).send(listParrainageDemandes);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/parrainage-demandes", async (req: Request, res: Response) => {
        const validation = createParrainageDemandeValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const parrainageDemandeRequest = validation.value;

        const parrainageDemandeRepo = AppDataSource.getRepository(ParrainageDemande);

        try {
            const parrainageDemandeCreated = await parrainageDemandeRepo.save(parrainageDemandeRequest);
            res.status(201).send(parrainageDemandeCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/parrainage-demandes/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = parrainageDemandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const parrainageDemandeId = validationResult.value;

            const parrainageDemandeRepository = AppDataSource.getRepository(ParrainageDemande);
            const parrainageDemande = await parrainageDemandeRepository.findOneBy({ id: parrainageDemandeId.id });
            if (parrainageDemande === null) {
                res.status(404).send({ "error": `ParrainageDemande ${parrainageDemandeId.id} not found` });
                return;
            }

            await parrainageDemandeRepository.remove(parrainageDemande);
            res.status(200).send("ParrainageDemande supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/parrainage-demandes/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = parrainageDemandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const parrainageDemandeId = validationResult.value;

            const parrainageDemandeUsecase = new ParrainageDemandeUsecase(AppDataSource);
            const parrainageDemande = await parrainageDemandeUsecase.getOneParrainageDemande(parrainageDemandeId.id);
            if (parrainageDemande === null) {
                res.status(404).send({ "error": `ParrainageDemande ${parrainageDemandeId.id} not found` });
                return;
            }
            res.status(200).send(parrainageDemande);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/parrainage-demandes/:id", async (req: Request, res: Response) => {
        const validation = updateParrainageDemandeValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateParrainageDemandeRequest = validation.value;

        try {
            const parrainageDemandeUsecase = new ParrainageDemandeUsecase(AppDataSource);

            const validationResult = parrainageDemandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedParrainageDemande = await parrainageDemandeUsecase.updateParrainageDemande(
                updateParrainageDemandeRequest.id,
                { ...updateParrainageDemandeRequest }
            );

            if (updatedParrainageDemande === null) {
                res.status(404).send({ "error": `ParrainageDemande ${updateParrainageDemandeRequest.id} not found` });
                return;
            }

            if (updatedParrainageDemande === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedParrainageDemande);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
