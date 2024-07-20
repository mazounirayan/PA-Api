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
exports.AutreDemandeHandler = void 0;
const database_1 = require("../../database/database");
const autreDemande_1 = require("../../database/entities/autreDemande");
const autreDemande_usecase_1 = require("../../domain/autreDemande-usecase");
const autreDemande_validator_1 = require("../validators/autreDemande-validator");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const AutreDemandeHandler = (app) => {
    app.get("/autre-demandes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = autreDemande_validator_1.listAutreDemandeValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listAutreDemandeRequest = validation.value;
        let limit = 20;
        if (listAutreDemandeRequest.limit) {
            limit = listAutreDemandeRequest.limit;
        }
        const page = (_a = listAutreDemandeRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const autreDemandeUsecase = new autreDemande_usecase_1.AutreDemandeUsecase(database_1.AppDataSource);
            const listAutreDemandes = yield autreDemandeUsecase.listAutreDemandes(Object.assign(Object.assign({}, listAutreDemandeRequest), { page, limit }));
            res.status(200).send(listAutreDemandes);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/autre-demandes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = autreDemande_validator_1.createAutreDemandeValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const autreDemandeRequest = validation.value;
        const autreDemandeRepo = database_1.AppDataSource.getRepository(autreDemande_1.AutreDemande);
        try {
            const autreDemandeCreated = yield autreDemandeRepo.save(autreDemandeRequest);
            res.status(201).send(autreDemandeCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/autre-demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = autreDemande_validator_1.autreDemandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const autreDemandeId = validationResult.value;
            const autreDemandeRepository = database_1.AppDataSource.getRepository(autreDemande_1.AutreDemande);
            const autreDemande = yield autreDemandeRepository.findOneBy({ id: autreDemandeId.id });
            if (autreDemande === null) {
                res.status(404).send({ "error": `AutreDemande ${autreDemandeId.id} not found` });
                return;
            }
            yield autreDemandeRepository.remove(autreDemande);
            res.status(200).send("AutreDemande supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/autre-demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = autreDemande_validator_1.autreDemandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const autreDemandeId = validationResult.value;
            const autreDemandeUsecase = new autreDemande_usecase_1.AutreDemandeUsecase(database_1.AppDataSource);
            const autreDemande = yield autreDemandeUsecase.getOneAutreDemande(autreDemandeId.id);
            if (autreDemande === null) {
                res.status(404).send({ "error": `AutreDemande ${autreDemandeId.id} not found` });
                return;
            }
            res.status(200).send(autreDemande);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/autre-demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = autreDemande_validator_1.updateAutreDemandeValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateAutreDemandeRequest = validation.value;
        try {
            const autreDemandeUsecase = new autreDemande_usecase_1.AutreDemandeUsecase(database_1.AppDataSource);
            const validationResult = autreDemande_validator_1.autreDemandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedAutreDemande = yield autreDemandeUsecase.updateAutreDemande(updateAutreDemandeRequest.id, Object.assign({}, updateAutreDemandeRequest));
            if (updatedAutreDemande === null) {
                res.status(404).send({ "error": `AutreDemande ${updateAutreDemandeRequest.id} not found` });
                return;
            }
            if (updatedAutreDemande === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedAutreDemande);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.AutreDemandeHandler = AutreDemandeHandler;
