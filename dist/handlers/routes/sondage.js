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
exports.SondageHandler = void 0;
const database_1 = require("../../database/database");
const sondage_1 = require("../../database/entities/sondage");
const sondage_usecase_1 = require("../../domain/sondage-usecase");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const sondage_validator_1 = require("../validators/sondage-validator");
const SondageHandler = (app) => {
    app.get("/sondages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = sondage_validator_1.listSondageValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listSondageRequest = validation.value;
        let limit = 20;
        if (listSondageRequest.limit) {
            limit = listSondageRequest.limit;
        }
        const page = (_a = listSondageRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const sondageUsecase = new sondage_usecase_1.SondageUsecase(database_1.AppDataSource);
            const listSondages = yield sondageUsecase.listSondages(Object.assign(Object.assign({}, listSondageRequest), { page, limit }));
            res.status(200).send(listSondages);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/sondages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = sondage_validator_1.createSondageValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const sondageRequest = validation.value;
        const sondageRepo = database_1.AppDataSource.getRepository(sondage_1.Sondage);
        try {
            const sondageCreated = yield sondageRepo.save(sondageRequest);
            res.status(201).send(sondageCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/sondages/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = sondage_validator_1.sondageIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const sondageId = validationResult.value;
            const sondageRepository = database_1.AppDataSource.getRepository(sondage_1.Sondage);
            const sondage = yield sondageRepository.findOneBy({ id: sondageId.id });
            if (sondage === null) {
                res.status(404).send({ "error": `Sondage ${sondageId.id} not found` });
                return;
            }
            yield sondageRepository.remove(sondage);
            res.status(200).send("Sondage supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/sondages/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = sondage_validator_1.sondageIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const sondageId = validationResult.value;
            const sondageUsecase = new sondage_usecase_1.SondageUsecase(database_1.AppDataSource);
            const sondage = yield sondageUsecase.getOneSondage(sondageId.id);
            if (sondage === null) {
                res.status(404).send({ "error": `Sondage ${sondageId.id} not found` });
                return;
            }
            res.status(200).send(sondage);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/sondages/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = sondage_validator_1.updateSondageValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateSondageRequest = validation.value;
        try {
            const sondageUsecase = new sondage_usecase_1.SondageUsecase(database_1.AppDataSource);
            const validationResult = sondage_validator_1.sondageIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedSondage = yield sondageUsecase.updateSondage(updateSondageRequest.id, Object.assign({}, updateSondageRequest));
            if (updatedSondage === null) {
                res.status(404).send({ "error": `Sondage ${updateSondageRequest.id} not found` });
                return;
            }
            if (updatedSondage === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedSondage);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.SondageHandler = SondageHandler;
