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
exports.PropositionUsecase = void 0;
const proposition_1 = require("../database/entities/proposition");
class PropositionUsecase {
    constructor(db) {
        this.db = db;
    }
    listPropositions(listPropositionRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(proposition_1.Proposition, 'proposition');
            if (listPropositionRequest.question) {
                query.andWhere("proposition.question = :question", { question: listPropositionRequest.question });
            }
            if (listPropositionRequest.choix && listPropositionRequest.choix.length > 0) {
                query.andWhere("proposition.choix IN (:...choix)", { choix: listPropositionRequest.choix });
            }
            if (listPropositionRequest.type) {
                query.andWhere("proposition.type = :type", { type: listPropositionRequest.type });
            }
            if (listPropositionRequest.ag) {
                query.andWhere("proposition.agId = :ag", { ag: listPropositionRequest.ag });
            }
            if (listPropositionRequest.sondage) {
                query.andWhere("proposition.sondageId = :sondage", { sondage: listPropositionRequest.sondage });
            }
            query.leftJoinAndSelect('proposition.ag', 'ag')
                .leftJoinAndSelect('proposition.sondage', 'sondage')
                .leftJoinAndSelect('proposition.votes', 'votes')
                .skip((listPropositionRequest.page - 1) * listPropositionRequest.limit)
                .take(listPropositionRequest.limit);
            const [Propositions, totalCount] = yield query.getManyAndCount();
            return {
                Propositions,
                totalCount
            };
        });
    }
    getOneProposition(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(proposition_1.Proposition, 'proposition')
                .leftJoinAndSelect('proposition.ag', 'ag')
                .leftJoinAndSelect('proposition.sondage', 'sondage')
                .leftJoinAndSelect('proposition.votes', 'votes')
                .where("proposition.id = :id", { id: id });
            const proposition = yield query.getOne();
            if (!proposition) {
                console.log({ error: `Proposition ${id} not found` });
                return null;
            }
            return proposition;
        });
    }
    updateProposition(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { question, choix, type, ag, sondage }) {
            const repo = this.db.getRepository(proposition_1.Proposition);
            const propositionFound = yield repo.findOneBy({ id });
            if (propositionFound === null)
                return null;
            if (question === undefined && choix === undefined && type === undefined && ag === undefined && sondage === undefined) {
                return "No changes";
            }
            if (question) {
                propositionFound.question = question;
            }
            if (choix) {
                propositionFound.choix = choix;
            }
            if (type) {
                propositionFound.type = type;
            }
            if (ag) {
                propositionFound.ag = ag;
            }
            if (sondage) {
                propositionFound.sondage = sondage;
            }
            const propositionUpdate = yield repo.save(propositionFound);
            return propositionUpdate;
        });
    }
}
exports.PropositionUsecase = PropositionUsecase;
