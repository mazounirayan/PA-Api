import express, { Request, Response } from "express";
import { AppDataSource } from "../../database/database";
import { Visiteur } from "../../database/entities/visiteur";
import { VisiteurUsecase } from "../../domain/visiteur-usecase";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";
import { listVisiteurValidation, createVisiteurValidation, updateVisiteurValidation, visiteurEmailValidation, verifVisiteur } from "../validators/visiteur-validator";

export const VisiteurHandler = (app: express.Express) => {
    app.get("/visiteurs", async (req: Request, res: Response) => {
        const validation = listVisiteurValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listVisiteurRequest = validation.value;
        let limit = 20;
        if (listVisiteurRequest.limit) {
            limit = listVisiteurRequest.limit;
        }
        const page = listVisiteurRequest.page ?? 1;

        try {
            const visiteurUsecase = new VisiteurUsecase(AppDataSource);
            const listVisiteurs = await visiteurUsecase.listVisiteurs({ ...listVisiteurRequest, page, limit });
            res.status(200).send(listVisiteurs);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/verifVisiteur", async (req: Request, res: Response) => {

        console.log(req.body)
        const validation = verifVisiteur.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        try {
            const visiteurUsecase = new VisiteurUsecase(AppDataSource);
            const verifVisiteur = await visiteurUsecase.verifVisiteur(validation.value.email, validation.value.numTel)

            if(verifVisiteur[0]['count(*)'] > 0){
                res.status(200).send({ response: "Visiteur existant" });
                return;
            }
            res.status(201).send({ response: "Visiteur non existant" });

        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/visiteursEmail", async (req: Request, res: Response) => {


        try {
            const visiteurUsecase = new VisiteurUsecase(AppDataSource);
            const listVisiteurEmail = await visiteurUsecase.getVisiteurEmail()

            res.status(200).send(listVisiteurEmail);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/visiteurs", async (req: Request, res: Response) => {
        const validation = createVisiteurValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const visiteurRequest = validation.value;

        const visiteurRepo = AppDataSource.getRepository(Visiteur);
        const visiteurUsecase = new VisiteurUsecase(AppDataSource);

        const emailExists = await visiteurUsecase.verifEmail(visiteurRequest.email);

        if (emailExists[0].verif > 0) {
            res.status(209).send({ "error": `Visiteur ${visiteurRequest.email} already exists` });
            return;
        }

        try {
            const visiteurCreated = await visiteurRepo.save(visiteurRequest);
            res.status(201).send(visiteurCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/visiteurs/:email", async (req: Request, res: Response) => {
        try {
            const validationResult = visiteurEmailValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const visiteurEmail = validationResult.value;

            const visiteurRepository = AppDataSource.getRepository(Visiteur);
            const visiteur = await visiteurRepository.findOneBy({ email: visiteurEmail.email });
            if (visiteur === null) {
                res.status(404).send({ "error": `Visiteur ${visiteurEmail.email} not found` });
                return;
            }

            await visiteurRepository.remove(visiteur);
            res.status(200).send("Visiteur supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/visiteurs/:email", async (req: Request, res: Response) => {
        try {
            const validationResult = visiteurEmailValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
            const visiteurEmail = validationResult.value;

            const visiteurUsecase = new VisiteurUsecase(AppDataSource);
            const visiteur = await visiteurUsecase.getOneVisiteur(visiteurEmail.email);
            if (visiteur === null) {
                res.status(404).send({ "error": `Visiteur ${visiteurEmail.email} not found` });
                return;
            }
            res.status(200).send(visiteur);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/visiteurs/:email", async (req: Request, res: Response) => {
        const validation = updateVisiteurValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const updateVisiteurRequest = validation.value;

        try {
            const visiteurUsecase = new VisiteurUsecase(AppDataSource);

            const validationResult = visiteurEmailValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedVisiteur = await visiteurUsecase.updateVisiteur(
                updateVisiteurRequest.email,
                { ...updateVisiteurRequest }
            );

            if (updatedVisiteur === null) {
                res.status(404).send({ "error": `Visiteur ${updateVisiteurRequest.email} not found` });
                return;
            }

            if (updatedVisiteur === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }

            res.status(200).send(updatedVisiteur);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};