import express, { Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Demande } from '../../database/entities/demande';
import { DemandeUsecase } from '../../domain/demande-usecase';
import { listDemandeValidation, createDemandeValidation, demandeIdValidation, updateDemandeValidation } from '../validators/demande-validator';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';


export const DemandeHandler = (app: express.Express) => {
    app.get("/demandes", async (req: Request, res: Response) => {
        const validation = listDemandeValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listDemandeRequest = validation.value;
        let limit = 20;
        if (listDemandeRequest.limit) {
            limit = listDemandeRequest.limit;
        }
        const page = listDemandeRequest.page ?? 1;

        try {
            const demandeUsecase = new DemandeUsecase(AppDataSource);
            const listDemandes = await demandeUsecase.listDemandes({ ...listDemandeRequest, page, limit });
            res.status(200).send(listDemandes);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/demandes", async (req: Request, res: Response) => {
        const validation = createDemandeValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const demandeRequest = validation.value;

        const demandeRepo = AppDataSource.getRepository(Demande);

        try {
            const demandeCreated = await demandeRepo.save(demandeRequest);
            res.status(201).send(demandeCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/demandes/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = demandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const demandeId = validationResult.value;

            const demandeRepository = AppDataSource.getRepository(Demande);
            const demande = await demandeRepository.findOneBy({ id: demandeId.id });
            if (demande === null) {
                res.status(404).send({ "error": `Demande ${demandeId.id} not found` });
                return;
            }

            await demandeRepository.remove(demande);
            res.status(200).send("Demande supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/demandes/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = demandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const demandeId = validationResult.value;

            const demandeUsecase = new DemandeUsecase(AppDataSource);
            const demande = await demandeUsecase.getOneDemande(demandeId.id);
            if (demande === null) {
                res.status(404).send({ "error": `Demande ${demandeId.id} not found` });
                return;
            }
            res.status(200).send(demande);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/demandes/:id", async (req: Request, res: Response) => {
        const validation = updateDemandeValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateDemandeRequest = validation.value;

        try {
            const demandeUsecase = new DemandeUsecase(AppDataSource);

            const validationResult = demandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedDemande = await demandeUsecase.updateDemande(
                updateDemandeRequest.id,
                { ...updateDemandeRequest }
            );

            if (updatedDemande === null) {
                res.status(404).send({ "error": `Demande ${updateDemandeRequest.id} not found` });
                return;
            }

            if (updatedDemande === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedDemande);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
