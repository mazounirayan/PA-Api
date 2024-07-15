"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAutreDemandeValidation = exports.updateAutreDemandeValidation = exports.autreDemandeIdValidation = exports.createAutreDemandeValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAutreDemandeValidation = joi_1.default.object({
    titre: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    demande: joi_1.default.number().required()
}).options({ abortEarly: false });
exports.autreDemandeIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateAutreDemandeValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    titre: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    demande: joi_1.default.number().optional()
});
exports.listAutreDemandeValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    titre: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    demande: joi_1.default.number().optional()
});
