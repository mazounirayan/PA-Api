import express, { Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { EvenementDemande } from '../../database/entities/evenementDemande';
import { EvenementDemandeUsecase } from '../../domain/evenementDemande-usecase';
import { listEvenementDemandeValidation, createEvenementDemandeValidation, evenementDemandeIdValidation, updateEvenementDemandeValidation } from '../validators/evenementDemande-validator';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';


export const EvenementDemandeHandler = (app: express.Express) => {
    app.get("/evenement-demandes", async (req: Request, res: Response) => {
        const validation = listEvenementDemandeValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listEvenementDemandeRequest = validation.value;
        let limit = 20;
        if (listEvenementDemandeRequest.limit) {
            limit = listEvenementDemandeRequest.limit;
        }
        const page = listEvenementDemandeRequest.page ?? 1;

        try {
            const evenementDemandeUsecase = new EvenementDemandeUsecase(AppDataSource);
            const listEvenementDemandes = await evenementDemandeUsecase.listEvenementDemandes({ ...listEvenementDemandeRequest, page, limit });
            res.status(200).send(listEvenementDemandes);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/evenement-demandes", async (req: Request, res: Response) => {
        const validation = createEvenementDemandeValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const evenementDemandeRequest = validation.value;

        const evenementDemandeRepo = AppDataSource.getRepository(EvenementDemande);

        try {
            const evenementDemandeCreated = await evenementDemandeRepo.save(evenementDemandeRequest);
            res.status(201).send(evenementDemandeCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/evenement-demandes/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = evenementDemandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const evenementDemandeId = validationResult.value;

            const evenementDemandeRepository = AppDataSource.getRepository(EvenementDemande);
            const evenementDemande = await evenementDemandeRepository.findOneBy({ id: evenementDemandeId.id });
            if (evenementDemande === null) {
                res.status(404).send({ "error": `EvenementDemande ${evenementDemandeId.id} not found` });
                return;
            }

            await evenementDemandeRepository.remove(evenementDemande);
            res.status(200).send("EvenementDemande supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/evenement-demandes/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = evenementDemandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const evenementDemandeId = validationResult.value;

            const evenementDemandeUsecase = new EvenementDemandeUsecase(AppDataSource);
            const evenementDemande = await evenementDemandeUsecase.getOneEvenementDemande(evenementDemandeId.id);
            if (evenementDemande === null) {
                res.status(404).send({ "error": `EvenementDemande ${evenementDemandeId.id} not found` });
                return;
            }
            res.status(200).send(evenementDemande);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/evenement-demandes/:id", async (req: Request, res: Response) => {
        const validation = updateEvenementDemandeValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateEvenementDemandeRequest = validation.value;

        try {
            const evenementDemandeUsecase = new EvenementDemandeUsecase(AppDataSource);

            const validationResult = evenementDemandeIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedEvenementDemande = await evenementDemandeUsecase.updateEvenementDemande(
                updateEvenementDemandeRequest.id,
                { ...updateEvenementDemandeRequest }
            );

            if (updatedEvenementDemande === null) {
                res.status(404).send({ "error": `EvenementDemande ${updateEvenementDemandeRequest.id} not found` });
                return;
            }

            if (updatedEvenementDemande === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedEvenementDemande);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
