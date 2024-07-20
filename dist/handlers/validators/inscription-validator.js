"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listInscriptionValidation = exports.verifEmail = exports.updateInscriptionValidation = exports.inscriptionIdValidation = exports.deleteInscriptionValidationRequest = exports.createInscriptionValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createInscriptionValidation = joi_1.default.object({
    emailVisiteur: joi_1.default.string().email().required(),
    evenement: joi_1.default.number().required()
}).options({ abortEarly: false });
exports.deleteInscriptionValidationRequest = joi_1.default.object({
    emailVisiteur: joi_1.default.string().email().required(),
    evenement: joi_1.default.number().required()
}).options({ abortEarly: false });
exports.inscriptionIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateInscriptionValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    emailVisiteur: joi_1.default.string().email().optional(),
    evenement: joi_1.default.number().optional()
});
exports.verifEmail = joi_1.default.object({
    emailVisiteur: joi_1.default.string().email().required(),
    evenement: joi_1.default.number().required()
}).options({ abortEarly: false });
exports.listInscriptionValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    emailVisiteur: joi_1.default.string().email().optional(),
    evenement: joi_1.default.number().optional()
});
