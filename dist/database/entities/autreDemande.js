"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutreDemande = void 0;
const typeorm_1 = require("typeorm");
const demande_1 = require("./demande");
let AutreDemande = class AutreDemande {
    constructor(id, titre, description, demande) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.demande = demande;
    }
};
exports.AutreDemande = AutreDemande;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AutreDemande.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AutreDemande.prototype, "titre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AutreDemande.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => demande_1.Demande, demande => demande.autreDemandes),
    __metadata("design:type", demande_1.Demande)
], AutreDemande.prototype, "demande", void 0);
exports.AutreDemande = AutreDemande = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, String, demande_1.Demande])
], AutreDemande);
