import express, { Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { AideProjet } from '../../database/entities/aideProjet';
import { AideProjetUsecase } from '../../domain/aideProjet-usecase';
import { listAideProjetValidation, createAideProjetValidation, aideProjetIdValidation, updateAideProjetValidation } from '../validators/aideProjet-validator';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';


export const AideProjetHandler = (app: express.Express) => {
    app.get("/aide-projets", async (req: Request, res: Response) => {
        const validation = listAideProjetValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listAideProjetRequest = validation.value;
        let limit = 20;
        if (listAideProjetRequest.limit) {
            limit = listAideProjetRequest.limit;
        }
        const page = listAideProjetRequest.page ?? 1;

        try {
            const aideProjetUsecase = new AideProjetUsecase(AppDataSource);
            const listAideProjets = await aideProjetUsecase.listAideProjets({ ...listAideProjetRequest, page, limit });
            res.status(200).send(listAideProjets);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/aide-projets", async (req: Request, res: Response) => {
        const validation = createAideProjetValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const aideProjetRequest = validation.value;

        const aideProjetRepo = AppDataSource.getRepository(AideProjet);

        try {
            const aideProjetCreated = await aideProjetRepo.save(aideProjetRequest);
            res.status(201).send(aideProjetCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/aide-projets/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = aideProjetIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const aideProjetId = validationResult.value;

            const aideProjetRepository = AppDataSource.getRepository(AideProjet);
            const aideProjet = await aideProjetRepository.findOneBy({ id: aideProjetId.id });
            if (aideProjet === null) {
                res.status(404).send({ "error": `AideProjet ${aideProjetId.id} not found` });
                return;
            }

            await aideProjetRepository.remove(aideProjet);
            res.status(200).send("AideProjet supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/aide-projets/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = aideProjetIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const aideProjetId = validationResult.value;

            const aideProjetUsecase = new AideProjetUsecase(AppDataSource);
            const aideProjet = await aideProjetUsecase.getOneAideProjet(aideProjetId.id);
            if (aideProjet === null) {
                res.status(404).send({ "error": `AideProjet ${aideProjetId.id} not found` });
                return;
            }
            res.status(200).send(aideProjet);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/aide-projets/:id", async (req: Request, res: Response) => {
        const validation = updateAideProjetValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateAideProjetRequest = validation.value;

        try {
            const aideProjetUsecase = new AideProjetUsecase(AppDataSource);

            const validationResult = aideProjetIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedAideProjet = await aideProjetUsecase.updateAideProjet(
                updateAideProjetRequest.id,
                { ...updateAideProjetRequest }
            );

            if (updatedAideProjet === null) {
                res.status(404).send({ "error": `AideProjet ${updateAideProjetRequest.id} not found` });
                return;
            }

            if (updatedAideProjet === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedAideProjet);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
