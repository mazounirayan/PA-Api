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
exports.Ag = void 0;
const typeorm_1 = require("typeorm");
const participationAG_1 = require("./participationAG");
const proposition_1 = require("./proposition");
let Ag = class Ag {
    constructor(id, nom, date, type, quorum, description, participations, propositions) {
        this.id = id;
        this.nom = nom;
        this.date = date;
        this.type = type;
        this.quorum = quorum;
        this.description = description;
        this.participations = participations;
        this.propositions = propositions;
    }
};
exports.Ag = Ag;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Ag.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Ag.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime'),
    __metadata("design:type", Date)
], Ag.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ag.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Ag.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Ag.prototype, "quorum", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => participationAG_1.ParticipationAG, participationAG => participationAG.ag),
    __metadata("design:type", Array)
], Ag.prototype, "participations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => proposition_1.Proposition, proposition => proposition.ag),
    __metadata("design:type", Array)
], Ag.prototype, "propositions", void 0);
exports.Ag = Ag = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, Date, String, Number, String, Array, Array])
], Ag);
