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
exports.EvenementUser = void 0;
const typeorm_1 = require("typeorm");
const evenement_1 = require("./evenement");
const user_1 = require("./user");
let EvenementUser = class EvenementUser {
    constructor(id, evenement, user) {
        this.id = id;
        this.evenement = evenement;
        this.user = user;
    }
};
exports.EvenementUser = EvenementUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EvenementUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => evenement_1.Evenement, evenement => evenement.evenementUsers),
    __metadata("design:type", evenement_1.Evenement)
], EvenementUser.prototype, "evenement", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.evenementUsers),
    __metadata("design:type", user_1.User)
], EvenementUser.prototype, "user", void 0);
exports.EvenementUser = EvenementUser = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, evenement_1.Evenement, user_1.User])
], EvenementUser);
