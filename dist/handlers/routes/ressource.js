"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RessourceHandler = void 0;
const generate_validation_message_1 = require("../validators/generate-validation-message");
const database_1 = require("../../database/database");
const ressource_validator_1 = require("../validators/ressource-validator");
const ressource_usecase_1 = require("../../domain/ressource-usecase");
const ressource_1 = require("../../database/entities/ressource");
const RessourceHandler = (app) => {
    app.get("/ressources", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = ressource_validator_1.listRessourceValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listRessourceRequest = validation.value;
        let limit = 20;
        if (listRessourceRequest.limit) {
            limit = listRessourceRequest.limit;
        }
        const page = (_a = listRessourceRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const ressourceUsecase = new ressource_usecase_1.RessourceUsecase(database_1.AppDataSource);
            const listRessources = yield ressourceUsecase.listRessources(Object.assign(Object.assign({}, listRessourceRequest), { page, limit }));
            res.status(200).send(listRessources);
        }
        catch (error) {
            console.log(error);
        }
    }));
    app.post("/ressources", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = ressource_validator_1.createRessourceValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const ressourceRequest = validation.value;
        const ressourceRepo = database_1.AppDataSource.getRepository(ressource_1.Ressource);
        try {
            const ressourceCreated = yield ressourceRepo.save(ressourceRequest);
            res.status(201).send(ressourceRequest);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/ressources/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = ressource_validator_1.ressourceIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const ressourceId = validationResult.value;
            const RessourceRepository = database_1.AppDataSource.getRepository(ressource_1.Ressource);
            const ressource = yield RessourceRepository.findOneBy({ id: ressourceId.id });
            if (ressource === null) {
                res.status(404).send({ "error": `ressource ${ressourceId.id} not found` });
                return;
            }
            yield RessourceRepository.remove(ressource);
            res.status(200).send("Ressource supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/ressources/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = ressource_validator_1.ressourceIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const ressourceId = validationResult.value;
            const RessourceRepository = database_1.AppDataSource.getRepository(ressource_1.Ressource);
            const ressource = yield RessourceRepository.findOneBy({ id: ressourceId.id });
            if (ressource === null) {
                res.status(404).send({ "error": `ressource ${ressourceId.id} not found` });
                return;
            }
            res.status(200).send(ressource);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/ressources/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = ressource_validator_1.updateRessourceValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const UpdateRessourceRequest = validation.value;
        try {
            const ressourceUsecase = new ressource_usecase_1.RessourceUsecase(database_1.AppDataSource);
            const validationResult = ressource_validator_1.ressourceIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedressource = yield ressourceUsecase.updateRessource(UpdateRessourceRequest.id, Object.assign({}, UpdateRessourceRequest));
            if (updatedressource === null) {
                res.status(404).send({ "error": `ressource ${UpdateRessourceRequest.id} not found ` });
                return;
            }
            if (updatedressource === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedressource);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.RessourceHandler = RessourceHandler;
