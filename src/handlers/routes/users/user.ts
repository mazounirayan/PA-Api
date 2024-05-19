import express, { Request, Response } from "express"
import { AppDataSource } from "../../../database/database"
import { compare, hash } from "bcrypt";
import { createUserValidation, listUserValidation, LoginUserValidation, updateUserValidation } from "../../validators/user-validator"
import { generateValidationErrorMessage } from "../../validators/generate-validation-message";
import { User } from "../../../database/entities/user";
import { sign } from "jsonwebtoken";
import { Token } from "../../../database/entities/token";
import { UserUsecase } from "../../../domain/user-usecase";
import { authMiddlewareAdherent, authMiddlewareAdminstrateur, authMiddlewareAll } from "../../middleware/auth-middleware";

export const UserHandler = (app: express.Express) => {

    app.get("/users", async (req: Request, res: Response) => {
        const validation = listUserValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listUserRequest = validation.value
        let limit = 20
        if (listUserRequest.limit) {
            limit = listUserRequest.limit
        }
        const page = listUserRequest.page ?? 1

        try {
            const userUsecase = new UserUsecase(AppDataSource);
            const listusers = await userUsecase.listUser({ ...listUserRequest, page, limit })
            res.status(200).send(listusers)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.patch("/users/:id", authMiddlewareAll, async (req: Request, res: Response) => {

        const validation = updateUserValidation.validate({ ...req.params, ...req.body })

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateUserRequest = validation.value

        try {
            const userUsecase = new UserUsecase(AppDataSource);

            const updatedUser = await userUsecase.updateUser(updateUserRequest.id, { ...updateUserRequest })
            
            if (updatedUser === null) {
                res.status(404).send({ "error": `User ${updateUserRequest.id} not found` })
                return
            }



            res.status(200).send(updatedUser)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })


}


