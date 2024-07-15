"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvenementDemandeValidation = exports.updateEvenementDemandeValidation = exports.evenementDemandeIdValidation = exports.createEvenementDemandeValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createEvenementDemandeValidation = joi_1.default.object({
    titre: joi_1.default.string().required(),
    date: joi_1.default.date().required(),
    description: joi_1.default.string().required(),
    lieu: joi_1.default.string().required(),
    demande: joi_1.default.number().required()
}).options({ abortEarly: false });
exports.evenementDemandeIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateEvenementDemandeValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    titre: joi_1.default.string().optional(),
    date: joi_1.default.date().optional(),
    description: joi_1.default.string().optional(),
    lieu: joi_1.default.string().optional(),
    demande: joi_1.default.number().optional()
});
exports.listEvenementDemandeValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    titre: joi_1.default.string().optional(),
    date: joi_1.default.date().optional(),
    description: joi_1.default.string().optional(),
    lieu: joi_1.default.string().optional(),
    demande: joi_1.default.number().optional()
});
