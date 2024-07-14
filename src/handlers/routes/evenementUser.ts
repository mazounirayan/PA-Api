import express, { Request, Response } from 'express';
import { AppDataSource } from '../../database/database';
import { EvenementUser } from '../../database/entities/evenementUser';
import { EvenementUserUsecase } from '../../domain/evenementUser-usecase';
import { listEvenementUserValidation, createEvenementUserValidation, evenementUserIdValidation, updateEvenementUserValidation } from '../validators/evenementUser-validator';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';

export const EvenementUserHandler = (app: express.Express) => {
    app.get("/evenement-users", async (req: Request, res: Response) => {
        const validation = listEvenementUserValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listEvenementUserRequest = validation.value;
        let limit = 20;
        if (listEvenementUserRequest.limit) {
            limit = listEvenementUserRequest.limit;
        }
        const page = listEvenementUserRequest.page ?? 1;

        try {
            const evenementUserUsecase = new EvenementUserUsecase(AppDataSource);
            const listEvenementUsers = await evenementUserUsecase.listEvenementUsers({ ...listEvenementUserRequest, page, limit });
            res.status(200).send(listEvenementUsers);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/evenement-users", async (req: Request, res: Response) => {
        const validation = createEvenementUserValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const evenementUserRequest = validation.value;

        const evenementUserRepo = AppDataSource.getRepository(EvenementUser);

        try {
            const evenementUserCreated = await evenementUserRepo.save(evenementUserRequest);
            res.status(201).send(evenementUserCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/evenement-users/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = evenementUserIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const evenementUserId = validationResult.value;

            const evenementUserRepository = AppDataSource.getRepository(EvenementUser);
            const evenementUser = await evenementUserRepository.findOneBy({ id: evenementUserId.id });
            if (evenementUser === null) {
                res.status(404).send({ "error": `EvenementUser ${evenementUserId.id} not found` });
                return;
            }

            await evenementUserRepository.remove(evenementUser);
            res.status(200).send("EvenementUser supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/evenement-users/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = evenementUserIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const evenementUserId = validationResult.value;

            const evenementUserUsecase = new EvenementUserUsecase(AppDataSource);
            const evenementUser = await evenementUserUsecase.getOneEvenementUser(evenementUserId.id);
            if (evenementUser === null) {
                res.status(404).send({ "error": `EvenementUser ${evenementUserId.id} not found` });
                return;
            }
            res.status(200).send(evenementUser);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/evenement-users/:id", async (req: Request, res: Response) => {
        const validation = updateEvenementUserValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateEvenementUserRequest = validation.value;

        try {
            const evenementUserUsecase = new EvenementUserUsecase(AppDataSource);

            const validationResult = evenementUserIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedEvenementUser = await evenementUserUsecase.updateEvenementUser(
                updateEvenementUserRequest.id,
                { ...updateEvenementUserRequest }
            );

            if (updatedEvenementUser === null) {
                res.status(404).send({ "error": `EvenementUser ${updateEvenementUserRequest.id} not found` });
                return;
            }

            if (updatedEvenementUser === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedEvenementUser);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
