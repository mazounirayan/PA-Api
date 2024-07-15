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
exports.AideProjetDemande = void 0;
const typeorm_1 = require("typeorm");
const demande_1 = require("./demande");
let AideProjetDemande = class AideProjetDemande {
    constructor(id, nom, descriptionProjet, budget, deadline, demande) {
        this.id = id;
        this.titre = nom;
        this.descriptionProjet = descriptionProjet;
        this.budget = budget;
        this.deadline = deadline;
        this.demande = demande;
    }
};
exports.AideProjetDemande = AideProjetDemande;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AideProjetDemande.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AideProjetDemande.prototype, "titre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AideProjetDemande.prototype, "descriptionProjet", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AideProjetDemande.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], AideProjetDemande.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => demande_1.Demande, demande => demande.aideProjetDemandes),
    __metadata("design:type", demande_1.Demande)
], AideProjetDemande.prototype, "demande", void 0);
exports.AideProjetDemande = AideProjetDemande = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, String, Number, Date, demande_1.Demande])
], AideProjetDemande);
