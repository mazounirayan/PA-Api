import express from "express";
import { initRoutes } from "./handlers/routes/routes";
import { AppDataSource } from "./database/database";
import cors from 'cors';
//import 'dotenv/config';
//import { swaggerDocs } from "./swagger/swagger";
//import "reflect-metadata"


/**            const validationResult = userIdValidation.validate({ ...req.params, ...req.body });


            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const userUsecase = new UserUsecase(AppDataSource);
            if(!await userUsecase.verifUser(+req.params.id, req.body.token)){
                res.status(400).send({ "error": `Bad user` });
                return;
            } */
const main = async () => {
    const app = express()
    const port = 3006

    try {

        await AppDataSource.initialize()
        console.error("well connected to database")
    } catch (error) {
        console.log(error)
        console.error("Cannot contact database")
        process.exit(1)
    }
    app.use(cors());
   

    app.use(express.json())
    
    //swaggerDocs(app, port)

    initRoutes(app)
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

main()