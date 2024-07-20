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
exports.ParrainageDemandeHandler = void 0;
const parrainageDemande_validator_1 = require("../validators/parrainageDemande-validator");
const database_1 = require("../../database/database");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const parrainageDemande_1 = require("../../database/entities/parrainageDemande");
const parrainageDemande_usecase_1 = require("../../domain/parrainageDemande-usecase");
const ParrainageDemandeHandler = (app) => {
    app.get("/parrainage-demandes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = parrainageDemande_validator_1.listParrainageDemandeValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listParrainageDemandeRequest = validation.value;
        let limit = 20;
        if (listParrainageDemandeRequest.limit) {
            limit = listParrainageDemandeRequest.limit;
        }
        const page = (_a = listParrainageDemandeRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const parrainageDemandeUsecase = new parrainageDemande_usecase_1.ParrainageDemandeUsecase(database_1.AppDataSource);
            const listParrainageDemandes = yield parrainageDemandeUsecase.listParrainageDemandes(Object.assign(Object.assign({}, listParrainageDemandeRequest), { page, limit }));
            res.status(200).send(listParrainageDemandes);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/parrainage-demandes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = parrainageDemande_validator_1.createParrainageDemandeValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const parrainageDemandeRequest = validation.value;
        const parrainageDemandeRepo = database_1.AppDataSource.getRepository(parrainageDemande_1.ParrainageDemande);
        try {
            const parrainageDemandeCreated = yield parrainageDemandeRepo.save(parrainageDemandeRequest);
            res.status(201).send(parrainageDemandeCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/parrainage-demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = parrainageDemande_validator_1.parrainageDemandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const parrainageDemandeId = validationResult.value;
            const parrainageDemandeRepository = database_1.AppDataSource.getRepository(parrainageDemande_1.ParrainageDemande);
            const parrainageDemande = yield parrainageDemandeRepository.findOneBy({ id: parrainageDemandeId.id });
            if (parrainageDemande === null) {
                res.status(404).send({ "error": `ParrainageDemande ${parrainageDemandeId.id} not found` });
                return;
            }
            yield parrainageDemandeRepository.remove(parrainageDemande);
            res.status(200).send("ParrainageDemande supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/parrainage-demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = parrainageDemande_validator_1.parrainageDemandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const parrainageDemandeId = validationResult.value;
            const parrainageDemandeUsecase = new parrainageDemande_usecase_1.ParrainageDemandeUsecase(database_1.AppDataSource);
            const parrainageDemande = yield parrainageDemandeUsecase.getOneParrainageDemande(parrainageDemandeId.id);
            if (parrainageDemande === null) {
                res.status(404).send({ "error": `ParrainageDemande ${parrainageDemandeId.id} not found` });
                return;
            }
            res.status(200).send(parrainageDemande);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/parrainage-demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = parrainageDemande_validator_1.updateParrainageDemandeValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateParrainageDemandeRequest = validation.value;
        try {
            const parrainageDemandeUsecase = new parrainageDemande_usecase_1.ParrainageDemandeUsecase(database_1.AppDataSource);
            const validationResult = parrainageDemande_validator_1.parrainageDemandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedParrainageDemande = yield parrainageDemandeUsecase.updateParrainageDemande(updateParrainageDemandeRequest.id, Object.assign({}, updateParrainageDemandeRequest));
            if (updatedParrainageDemande === null) {
                res.status(404).send({ "error": `ParrainageDemande ${updateParrainageDemandeRequest.id} not found` });
                return;
            }
            if (updatedParrainageDemande === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedParrainageDemande);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.ParrainageDemandeHandler = ParrainageDemandeHandler;
