"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvenementRessourceValidation = exports.updateEvenementRessourceValidation = exports.evenementRessourceIdValidation = exports.createEvenementRessourceValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createEvenementRessourceValidation = joi_1.default.object({
    evenement: joi_1.default.number().required(),
    ressource: joi_1.default.number().required()
});
exports.evenementRessourceIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateEvenementRessourceValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    evenement: joi_1.default.number().optional(),
    ressource: joi_1.default.number().optional()
});
exports.listEvenementRessourceValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    evenement: joi_1.default.number().optional(),
    ressource: joi_1.default.number().optional()
});
