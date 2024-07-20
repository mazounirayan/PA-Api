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
exports.EvenementDemande = void 0;
const typeorm_1 = require("typeorm");
const demande_1 = require("./demande");
let EvenementDemande = class EvenementDemande {
    constructor(id, nom, date, description, lieu, demande) {
        this.id = id;
        this.titre = nom;
        this.date = date;
        this.description = description;
        this.lieu = lieu;
        this.demande = demande;
    }
};
exports.EvenementDemande = EvenementDemande;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EvenementDemande.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EvenementDemande.prototype, "titre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], EvenementDemande.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EvenementDemande.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EvenementDemande.prototype, "lieu", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => demande_1.Demande, demande => demande.evenementDemandes),
    __metadata("design:type", demande_1.Demande)
], EvenementDemande.prototype, "demande", void 0);
exports.EvenementDemande = EvenementDemande = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, Date, String, String, demande_1.Demande])
], EvenementDemande);
