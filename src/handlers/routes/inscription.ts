import express, { Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { Inscription } from '../../database/entities/inscription';
import { InscriptionUsecase } from '../../domain/inscription-usecase';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';
import { listInscriptionValidation, createInscriptionValidation, inscriptionIdValidation, updateInscriptionValidation } from '../validators/inscription-validator';
import { EvenementUsecase } from '../../domain/evenement-usecase';


export const InscriptionHandler = (app: express.Express) => {
    app.get("/inscriptions", async (req: Request, res: Response) => {
        const validation = listInscriptionValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listInscriptionRequest = validation.value;
        let limit = 20;
        if (listInscriptionRequest.limit) {
            limit = listInscriptionRequest.limit;
        }
        const page = listInscriptionRequest.page ?? 1;

        try {
            const inscriptionUsecase = new InscriptionUsecase(AppDataSource);
            const listInscriptions = await inscriptionUsecase.listInscriptions({ ...listInscriptionRequest, page, limit });
            res.status(200).send(listInscriptions);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/inscriptions", async (req: Request, res: Response) => {
        const validation = createInscriptionValidation.validate(req.body);

        
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const inscriptionRequest = validation.value;

        const inscriptionUsecase = new InscriptionUsecase(AppDataSource);
        const nbPlace = await inscriptionUsecase.nbPlace(+inscriptionRequest.evenement);
        if(nbPlace[0].nbPlace == 0){
            res.status(400).send({ error: "Plus de place disponible" });
            return;
        }
        const inscriptionRepo = AppDataSource.getRepository(Inscription);

        try {
            const inscriptionCreated = await inscriptionRepo.save(inscriptionRequest);
            const evenementUsecase = new EvenementUsecase(AppDataSource);
            const nbPlaceMoinsUn = await evenementUsecase.nbPlaceMoinsUn(+inscriptionRequest.evenement);
            console.log(nbPlaceMoinsUn);
            res.status(201).send(inscriptionCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/inscriptions/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = inscriptionIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const inscriptionId = validationResult.value;

            const inscriptionRepository = AppDataSource.getRepository(Inscription);
            const inscription = await inscriptionRepository.findOneBy({ id: inscriptionId.id });
            if (inscription === null) {
                res.status(404).send({ "error": `Inscription ${inscriptionId.id} not found` });
                return;
            }

            await inscriptionRepository.remove(inscription);
            res.status(200).send("Inscription supprimée avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/inscriptions/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = inscriptionIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const inscriptionId = validationResult.value;

            const inscriptionUsecase = new InscriptionUsecase(AppDataSource);
            const inscription = await inscriptionUsecase.getOneInscription(inscriptionId.id);
            if (inscription === null) {
                res.status(404).send({ "error": `Inscription ${inscriptionId.id} not found` });
                return;
            }
            res.status(200).send(inscription);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/inscriptions/:id", async (req: Request, res: Response) => {
        const validation = updateInscriptionValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateInscriptionRequest = validation.value;

        try {
            const inscriptionUsecase = new InscriptionUsecase(AppDataSource);

            const validationResult = inscriptionIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedInscription = await inscriptionUsecase.updateInscription(
                updateInscriptionRequest.id,
                { ...updateInscriptionRequest }
            );

            if (updatedInscription === null) {
                res.status(404).send({ "error": `Inscription ${updateInscriptionRequest.id} not found` });
                return;
            }

            if (updatedInscription === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedInscription);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
