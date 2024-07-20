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
exports.AideProjetDemandeHandler = void 0;
const generate_validation_message_1 = require("../validators/generate-validation-message");
const database_1 = require("../../database/database");
const aideProjetDemande_1 = require("../../database/entities/aideProjetDemande");
const aideProjetDemande_usecase_1 = require("../../domain/aideProjetDemande-usecase");
const aideProjetDemande_validator_1 = require("../validators/aideProjetDemande-validator");
const AideProjetDemandeHandler = (app) => {
    app.get("/aide-projet-demandes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = aideProjetDemande_validator_1.listAideProjetDemandeValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listAideProjetDemandeRequest = validation.value;
        let limit = 20;
        if (listAideProjetDemandeRequest.limit) {
            limit = listAideProjetDemandeRequest.limit;
        }
        const page = (_a = listAideProjetDemandeRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const aideProjetDemandeUsecase = new aideProjetDemande_usecase_1.AideProjetDemandeUsecase(database_1.AppDataSource);
            const listAideProjetDemandes = yield aideProjetDemandeUsecase.listAideProjetDemandes(Object.assign(Object.assign({}, listAideProjetDemandeRequest), { page, limit }));
            res.status(200).send(listAideProjetDemandes);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/aide-projet-demandes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = aideProjetDemande_validator_1.createAideProjetDemandeValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const aideProjetDemandeRequest = validation.value;
        const aideProjetDemandeRepo = database_1.AppDataSource.getRepository(aideProjetDemande_1.AideProjetDemande);
        try {
            const aideProjetDemandeCreated = yield aideProjetDemandeRepo.save(aideProjetDemandeRequest);
            res.status(201).send(aideProjetDemandeCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/aide-projet-demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = aideProjetDemande_validator_1.aideProjetDemandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const aideProjetDemandeId = validationResult.value;
            const aideProjetDemandeRepository = database_1.AppDataSource.getRepository(aideProjetDemande_1.AideProjetDemande);
            const aideProjetDemande = yield aideProjetDemandeRepository.findOneBy({ id: aideProjetDemandeId.id });
            if (aideProjetDemande === null) {
                res.status(404).send({ "error": `AideProjetDemande ${aideProjetDemandeId.id} not found` });
                return;
            }
            yield aideProjetDemandeRepository.remove(aideProjetDemande);
            res.status(200).send("AideProjetDemande supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/aide-projet-demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = aideProjetDemande_validator_1.aideProjetDemandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const aideProjetDemandeId = validationResult.value;
            const aideProjetDemandeUsecase = new aideProjetDemande_usecase_1.AideProjetDemandeUsecase(database_1.AppDataSource);
            const aideProjetDemande = yield aideProjetDemandeUsecase.getOneAideProjetDemande(aideProjetDemandeId.id);
            if (aideProjetDemande === null) {
                res.status(404).send({ "error": `AideProjetDemande ${aideProjetDemandeId.id} not found` });
                return;
            }
            res.status(200).send(aideProjetDemande);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/aide-projet-demandes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = aideProjetDemande_validator_1.updateAideProjetDemandeValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateAideProjetDemandeRequest = validation.value;
        try {
            const aideProjetDemandeUsecase = new aideProjetDemande_usecase_1.AideProjetDemandeUsecase(database_1.AppDataSource);
            const validationResult = aideProjetDemande_validator_1.aideProjetDemandeIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedAideProjetDemande = yield aideProjetDemandeUsecase.updateAideProjetDemande(updateAideProjetDemandeRequest.id, Object.assign({}, updateAideProjetDemandeRequest));
            if (updatedAideProjetDemande === null) {
                res.status(404).send({ "error": `AideProjetDemande ${updateAideProjetDemandeRequest.id} not found` });
                return;
            }
            if (updatedAideProjetDemande === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedAideProjetDemande);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.AideProjetDemandeHandler = AideProjetDemandeHandler;
