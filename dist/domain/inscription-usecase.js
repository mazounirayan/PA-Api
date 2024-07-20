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
exports.InscriptionUsecase = void 0;
const inscription_1 = require("../database/entities/inscription");
class InscriptionUsecase {
    constructor(db) {
        this.db = db;
    }
    deleteInscription(email, idEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(inscription_1.Inscription);
            const sqlQuery = `delete from inscription where emailVisiteur like ? and evenementId = ?;`;
            const deleteInscription = yield entityManager.query(sqlQuery, [email, idEvent]);
            return deleteInscription;
        });
    }
    verifEmail(email, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(inscription_1.Inscription);
            const sqlQuery = `select count(*) from inscription where emailVisiteur=? and evenementId=?;`;
            const verifEmail = yield entityManager.query(sqlQuery, [email, id]);
            return verifEmail;
        });
    }
    nbPlace(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db.getRepository(inscription_1.Inscription);
            const sqlQuery = `select nbPlace from evenement where id=?;`;
            const nbPlace = yield entityManager.query(sqlQuery, [id]);
            return nbPlace;
        });
    }
    listInscriptions(listInscriptionRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(inscription_1.Inscription, 'inscription');
            if (listInscriptionRequest.emailVisiteur) {
                query.andWhere("inscription.emailVisiteur = :emailVisiteur", { emailVisiteur: listInscriptionRequest.emailVisiteur });
            }
            if (listInscriptionRequest.evenement) {
                query.andWhere("inscription.evenementId = :evenement", { evenement: listInscriptionRequest.evenement });
            }
            query.leftJoinAndSelect('inscription.evenement', 'evenement')
                .skip((listInscriptionRequest.page - 1) * listInscriptionRequest.limit)
                .take(listInscriptionRequest.limit);
            const [Inscriptions, totalCount] = yield query.getManyAndCount();
            return {
                Inscriptions,
                totalCount
            };
        });
    }
    getOneInscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(inscription_1.Inscription, 'inscription')
                .leftJoinAndSelect('inscription.evenement', 'evenement')
                .where("inscription.id = :id", { id: id });
            const inscription = yield query.getOne();
            if (!inscription) {
                console.log({ error: `Inscription ${id} not found` });
                return null;
            }
            return inscription;
        });
    }
    updateInscription(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { emailVisiteur, evenement }) {
            const repo = this.db.getRepository(inscription_1.Inscription);
            const inscriptionFound = yield repo.findOneBy({ id });
            if (inscriptionFound === null)
                return null;
            if (emailVisiteur === undefined && evenement === undefined) {
                return "No changes";
            }
            if (emailVisiteur) {
                inscriptionFound.emailVisiteur = emailVisiteur;
            }
            if (evenement) {
                inscriptionFound.evenement = evenement;
            }
            const inscriptionUpdate = yield repo.save(inscriptionFound);
            return inscriptionUpdate;
        });
    }
}
exports.InscriptionUsecase = InscriptionUsecase;
