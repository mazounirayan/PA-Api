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
exports.AgHandler = void 0;
const database_1 = require("../../database/database");
const ag_1 = require("../../database/entities/ag");
const ag_usecase_1 = require("../../domain/ag-usecase");
const ag_validator_1 = require("../validators/ag-validator");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const AgHandler = (app) => {
    app.get("/ags", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = ag_validator_1.listAgValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listAgRequest = validation.value;
        let limit = 20;
        if (listAgRequest.limit) {
            limit = listAgRequest.limit;
        }
        const page = (_a = listAgRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const agUsecase = new ag_usecase_1.AgUsecase(database_1.AppDataSource);
            const listAgs = yield agUsecase.listAgs(Object.assign(Object.assign({}, listAgRequest), { page, limit }));
            res.status(200).send(listAgs);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/ags", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = ag_validator_1.createAgValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const agRequest = validation.value;
        const agRepo = database_1.AppDataSource.getRepository(ag_1.Ag);
        try {
            const agCreated = yield agRepo.save(agRequest);
            res.status(201).send(agCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/ags/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = ag_validator_1.agIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const agId = validationResult.value;
            const agRepository = database_1.AppDataSource.getRepository(ag_1.Ag);
            const ag = yield agRepository.findOneBy({ id: agId.id });
            if (ag === null) {
                res.status(404).send({ "error": `Ag ${agId.id} not found` });
                return;
            }
            yield agRepository.remove(ag);
            res.status(200).send("Ag supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/ags/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = ag_validator_1.agIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const agId = validationResult.value;
            const agUsecase = new ag_usecase_1.AgUsecase(database_1.AppDataSource);
            const ag = yield agUsecase.getOneAg(agId.id);
            if (ag === null) {
                res.status(404).send({ "error": `Ag ${agId.id} not found` });
                return;
            }
            res.status(200).send(ag);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/ags/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = ag_validator_1.updateAgValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateAgRequest = validation.value;
        try {
            const agUsecase = new ag_usecase_1.AgUsecase(database_1.AppDataSource);
            const validationResult = ag_validator_1.agIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedAg = yield agUsecase.updateAg(updateAgRequest.id, Object.assign({}, updateAgRequest));
            if (updatedAg === null) {
                res.status(404).send({ "error": `Ag ${updateAgRequest.id} not found` });
                return;
            }
            if (updatedAg === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedAg);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.AgHandler = AgHandler;
