"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listParrainageDemandeValidation = exports.updateParrainageDemandeValidation = exports.parrainageDemandeIdValidation = exports.createParrainageDemandeValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createParrainageDemandeValidation = joi_1.default.object({
    detailsParrainage: joi_1.default.string().required(),
    parrain: joi_1.default.number().required(),
    demande: joi_1.default.number().required()
}).options({ abortEarly: false });
exports.parrainageDemandeIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateParrainageDemandeValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    detailsParrainage: joi_1.default.string().optional(),
    parrain: joi_1.default.number().optional(),
    demande: joi_1.default.number().optional()
});
exports.listParrainageDemandeValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    detailsParrainage: joi_1.default.string().optional(),
    parrain: joi_1.default.number().optional(),
    demande: joi_1.default.number().optional()
});
