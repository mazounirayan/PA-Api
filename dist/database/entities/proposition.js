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
exports.Proposition = exports.TypeProposition = void 0;
const typeorm_1 = require("typeorm");
const ag_1 = require("./ag");
const sondage_1 = require("./sondage");
const vote_1 = require("./vote");
var TypeProposition;
(function (TypeProposition) {
    TypeProposition["Checkbox"] = "checkbox";
    TypeProposition["Radio"] = "radio";
    TypeProposition["Text"] = "text";
})(TypeProposition || (exports.TypeProposition = TypeProposition = {}));
let Proposition = class Proposition {
    constructor(id, question, choix, type, ag, sondage, votes) {
        this.id = id;
        this.question = question;
        this.type = type;
        this.choix = choix;
        this.ag = ag;
        this.sondage = sondage;
        this.votes = votes;
    }
};
exports.Proposition = Proposition;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Proposition.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Proposition.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Proposition.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array") // Utilisation de "simple-array" pour TypeORM
    ,
    __metadata("design:type", Array)
], Proposition.prototype, "choix", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ag_1.Ag, ag => ag.propositions),
    __metadata("design:type", ag_1.Ag)
], Proposition.prototype, "ag", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sondage_1.Sondage, sondage => sondage.propositions),
    __metadata("design:type", sondage_1.Sondage)
], Proposition.prototype, "sondage", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vote_1.Vote, vote => vote.proposition),
    __metadata("design:type", Array)
], Proposition.prototype, "votes", void 0);
exports.Proposition = Proposition = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, Array, String, ag_1.Ag, sondage_1.Sondage, Array])
], Proposition);
