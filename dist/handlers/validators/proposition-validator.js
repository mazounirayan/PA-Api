"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPropositionValidation = exports.updatePropositionValidation = exports.propositionIdValidation = exports.createPropositionValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const proposition_1 = require("../../database/entities/proposition");
exports.createPropositionValidation = joi_1.default.object({
    question: joi_1.default.string().required(),
    choix: joi_1.default.array().items(joi_1.default.string()).required(),
    type: joi_1.default.string().valid(...Object.values(proposition_1.TypeProposition)).required(),
    ag: joi_1.default.number().optional(),
    sondage: joi_1.default.number().optional()
}).options({ abortEarly: false });
exports.propositionIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updatePropositionValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    question: joi_1.default.string().optional(),
    choix: joi_1.default.array().items(joi_1.default.string()).optional(),
    type: joi_1.default.string().valid(...Object.values(proposition_1.TypeProposition)).optional(),
    ag: joi_1.default.number().optional(),
    sondage: joi_1.default.number().optional()
});
exports.listPropositionValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    question: joi_1.default.string().optional(),
    choix: joi_1.default.string().optional(),
    type: joi_1.default.string().valid(...Object.values(proposition_1.TypeProposition)).optional(),
    ag: joi_1.default.number().optional(),
    sondage: joi_1.default.number().optional()
});
