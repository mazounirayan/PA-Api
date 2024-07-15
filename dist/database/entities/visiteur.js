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
exports.Visiteur = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const user_1 = require("./user");
let Visiteur = class Visiteur {
    constructor(nom, prenom, email, age, numTel, adresse, profession, dateInscription, estBenevole, parrain) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.age = age;
        this.numTel = numTel;
        this.adresse = adresse;
        this.profession = profession;
        this.dateInscription = dateInscription;
        this.estBenevole = estBenevole;
        this.parrain = parrain;
    }
};
exports.Visiteur = Visiteur;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        unique: true
    }),
    __metadata("design:type", String)
], Visiteur.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Visiteur.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Visiteur.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Visiteur.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Visiteur.prototype, "numTel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Visiteur.prototype, "adresse", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Visiteur.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], Visiteur.prototype, "dateInscription", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Visiteur.prototype, "estBenevole", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.parraine),
    __metadata("design:type", user_1.User)
], Visiteur.prototype, "parrain", void 0);
exports.Visiteur = Visiteur = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, Number, String, String, String, Date, Boolean, user_1.User])
], Visiteur);
