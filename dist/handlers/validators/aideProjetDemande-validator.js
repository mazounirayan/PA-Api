"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAideProjetDemandeValidation = exports.updateAideProjetDemandeValidation = exports.aideProjetDemandeIdValidation = exports.createAideProjetDemandeValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAideProjetDemandeValidation = joi_1.default.object({
    titre: joi_1.default.string().required(),
    descriptionProjet: joi_1.default.string().required(),
    budget: joi_1.default.number().required(),
    deadline: joi_1.default.date().required(),
    demande: joi_1.default.number().required()
}).options({ abortEarly: false });
exports.aideProjetDemandeIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateAideProjetDemandeValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    titre: joi_1.default.string().optional(),
    descriptionProjet: joi_1.default.string().optional(),
    budget: joi_1.default.number().optional(),
    deadline: joi_1.default.date().optional(),
    demande: joi_1.default.number().optional()
});
exports.listAideProjetDemandeValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    titre: joi_1.default.string().optional(),
    descriptionProjet: joi_1.default.string().optional(),
    budget: joi_1.default.number().optional(),
    deadline: joi_1.default.date().optional(),
    demande: joi_1.default.number().optional()
});
