"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisiteurUsecase = void 0;
const visiteur_1 = require("../database/entities/visiteur");
class VisiteurUsecase {
    constructor(db) {
        this.db = db;
    }
    verifVisiteur(email, numTel) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(visiteur_1.Visiteur);
            const sqlQuery = `select count(*) from visiteur where email like ? and numTel = ?;`;
            const nbPlace = yield entityManager.query(sqlQuery, [email, numTel]);
            return nbPlace;
        });
    }
    getVisiteurEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(visiteur_1.Visiteur);
            const sqlQuery = `SELECT GROUP_CONCAT(email SEPARATOR ', ') AS emails FROM visiteur;`;
            const visiteurEmails = yield entityManager.query(sqlQuery);
            return visiteurEmails;
        });
    }
    verifEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(visiteur_1.Visiteur);
            const sqlQuery = `select count(*) as verif from visiteur where email=?;`;
            const verifEmail = yield entityManager.query(sqlQuery, [email]);
            return verifEmail;
        });
    }
    listVisiteurs(listVisiteurRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(visiteur_1.Visiteur, 'visiteur');
            if (listVisiteurRequest.email) {
                query.andWhere("visiteur.email = :email", { email: listVisiteurRequest.email });
            }
            if (listVisiteurRequest.nom) {
                query.andWhere("visiteur.nom = :nom", { nom: listVisiteurRequest.nom });
            }
            if (listVisiteurRequest.prenom) {
                query.andWhere("visiteur.prenom = :prenom", { prenom: listVisiteurRequest.prenom });
            }
            if (listVisiteurRequest.age) {
                query.andWhere("visiteur.age = :age", { age: listVisiteurRequest.age });
            }
            if (listVisiteurRequest.numTel) {
                query.andWhere("visiteur.numTel = :numTel", { numTel: listVisiteurRequest.numTel });
            }
            if (listVisiteurRequest.adresse) {
                query.andWhere("visiteur.adresse = :adresse", { adresse: listVisiteurRequest.adresse });
            }
            if (listVisiteurRequest.profession) {
                query.andWhere("visiteur.profession = :profession", { profession: listVisiteurRequest.profession });
            }
            if (listVisiteurRequest.dateInscription) {
                query.andWhere("visiteur.dateInscription = :dateInscription", { dateInscription: listVisiteurRequest.dateInscription });
            }
            if (listVisiteurRequest.estBenevole !== undefined) {
                query.andWhere("visiteur.estBenevole = :estBenevole", { estBenevole: listVisiteurRequest.estBenevole });
            }
            if (listVisiteurRequest.parrain) {
                query.andWhere("visiteur.parrainId = :parrain", { parrain: listVisiteurRequest.parrain });
            }
            query.leftJoinAndSelect('visiteur.parrain', 'parrain')
                .skip((listVisiteurRequest.page - 1) * listVisiteurRequest.limit)
                .take(listVisiteurRequest.limit);
            const [Visiteurs, totalCount] = yield query.getManyAndCount();
            return {
                Visiteurs,
                totalCount
            };
        });
    }
    getOneVisiteur(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(visiteur_1.Visiteur, 'visiteur')
                .leftJoinAndSelect('visiteur.parrain', 'parrain')
                .where("visiteur.email = :email", { email: email });
            const visiteur = yield query.getOne();
            if (!visiteur) {
                console.log({ error: `Visiteur ${email} not found` });
                return null;
            }
            return visiteur;
        });
    }
    updateVisiteur(email_1, _a) {
        return __awaiter(this, arguments, void 0, function* (email, { nom, prenom, age, numTel, adresse, profession, dateInscription, estBenevole, parrain }) {
            const repo = this.db.getRepository(visiteur_1.Visiteur);
            const visiteurFound = yield repo.findOneBy({ email });
            if (visiteurFound === null)
                return null;
            if (nom === undefined && prenom === undefined && age === undefined && numTel === undefined && adresse === undefined && profession === undefined && dateInscription === undefined && estBenevole === undefined && parrain === undefined) {
                return "No changes";
            }
            if (nom) {
                visiteurFound.nom = nom;
            }
            if (prenom) {
                visiteurFound.prenom = prenom;
            }
            if (age !== undefined) {
                visiteurFound.age = age;
            }
            if (numTel) {
                visiteurFound.numTel = numTel;
            }
            if (adresse) {
                visiteurFound.adresse = adresse;
            }
            if (profession) {
                visiteurFound.profession = profession;
            }
            if (dateInscription) {
                visiteurFound.dateInscription = dateInscription;
            }
            if (estBenevole !== undefined) {
                visiteurFound.estBenevole = estBenevole;
            }
            if (parrain) {
                visiteurFound.parrain = parrain;
            }
            const visiteurUpdate = yield repo.save(visiteurFound);
            return visiteurUpdate;
        });
    }
}
exports.VisiteurUsecase = VisiteurUsecase;
