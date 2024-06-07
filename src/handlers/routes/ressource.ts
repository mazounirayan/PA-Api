import express, { Request, Response } from "express";
import { generateValidationErrorMessage } from "../validators/generate-validation-message";
import { AppDataSource } from "../../database/database";
import { createRessourceValidation, listRessourceValidation, ressourceIdValidation, updateRessourceValidation } from "../validators/ressource-validator";
import { RessourceUsecase } from "../../domain/ressource-usecase";
import { Ressource } from "../../database/entities/ressource";


export const RessourceHandler = (app: express.Express) => {
    
        app.get("/ressources", async (req: Request, res: Response) => {
            const validation = listRessourceValidation.validate(req.query)

            if (validation.error) {
                res.status(400).send(generateValidationErrorMessage(validation.error.details))
                return
            }

            const listRessourceRequest = validation.value
            let limit = 20
            if (listRessourceRequest.limit) {
                limit = listRessourceRequest.limit
            }
            const page = listRessourceRequest.page ?? 1

            try {
                const ressourceUsecase = new RessourceUsecase(AppDataSource);
                const listRessources = await ressourceUsecase.listRessources({ ...listRessourceRequest, page, limit })
                res.status(200).send(listRessources)
            } catch (error) {
                console.log(error)
            }
        })
    




    app.post("/ressources", async (req: Request, res: Response) => {
        const validation = createRessourceValidation.validate(req.body)
    
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }
    
        const ressourceRequest = validation.value
        const ressourceRepo = AppDataSource.getRepository(Ressource)
        try {
    
            const ressourceCreated = await ressourceRepo.save(
                ressourceRequest
            )
            res.status(201).send(ressourceRequest)
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" })
        }
    })
    

    
    app.delete("/ressources/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = ressourceIdValidation.validate(req.params)
    
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const ressourceId = validationResult.value
    
            const RessourceRepository = AppDataSource.getRepository(Ressource)
            const ressource = await RessourceRepository.findOneBy({ id: ressourceId.id })
            if (ressource === null) {
                res.status(404).send({ "error": `ressource ${ressourceId.id} not found` })
                return
            }
    
            await RessourceRepository.remove(ressource)
            res.status(200).send("Ressource supprimé avec succès")
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    
    app.get("/ressources/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = ressourceIdValidation.validate(req.params)
    
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const ressourceId = validationResult.value
    
            const RessourceRepository = AppDataSource.getRepository(Ressource)
            const ressource = await RessourceRepository.findOneBy({ id: ressourceId.id })
            if (ressource === null) {
                res.status(404).send({ "error": `ressource ${ressourceId.id} not found` })
                return
            }
            res.status(200).send(ressource)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    
    
    
    app.patch("/ressources/:id", async (req: Request, res: Response) => {
    
        const validation = updateRessourceValidation.validate({ ...req.params, ...req.body })
    
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }
    
        const UpdateRessourceRequest = validation.value
    
        try {
            const ressourceUsecase = new RessourceUsecase(AppDataSource);
    
            const validationResult = ressourceIdValidation.validate(req.params)
    
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
    
    
            const updatedressource = await ressourceUsecase.updateRessource(
                UpdateRessourceRequest.id,
                { ...UpdateRessourceRequest }
                )
    
            if (updatedressource === null) {
                res.status(404).send({ "error": `ressource ${UpdateRessourceRequest.id} not found `})
                return
            }

            if(updatedressource === "No update provided"){
                res.status(400).send({ "error": `No update provided`})
                return
            }
    
    
    
            res.status(200).send(updatedressource)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    
}
