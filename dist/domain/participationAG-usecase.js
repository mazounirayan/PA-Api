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
exports.ParticipationAGUsecase = void 0;
const participationAG_1 = require("../database/entities/participationAG");
class ParticipationAGUsecase {
    constructor(db) {
        this.db = db;
    }
    listParticipationAGs(listParticipationAGRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(participationAG_1.ParticipationAG, 'participationAG');
            if (listParticipationAGRequest.user) {
                query.andWhere("participationAG.userId = :user", { user: listParticipationAGRequest.user });
            }
            if (listParticipationAGRequest.ag) {
                query.andWhere("participationAG.agId = :ag", { ag: listParticipationAGRequest.ag });
            }
            query.leftJoinAndSelect('participationAG.user', 'user')
                .leftJoinAndSelect('participationAG.ag', 'ag')
                .skip((listParticipationAGRequest.page - 1) * listParticipationAGRequest.limit)
                .take(listParticipationAGRequest.limit);
            const [ParticipationAGs, totalCount] = yield query.getManyAndCount();
            return {
                ParticipationAGs,
                totalCount
            };
        });
    }
    getOneParticipationAG(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(participationAG_1.ParticipationAG, 'participationAG')
                .leftJoinAndSelect('participationAG.user', 'user')
                .leftJoinAndSelect('participationAG.ag', 'ag')
                .where("participationAG.id = :id", { id: id });
            const participationAG = yield query.getOne();
            if (!participationAG) {
                console.log({ error: `ParticipationAG ${id} not found` });
                return null;
            }
            return participationAG;
        });
    }
    updateParticipationAG(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { user, ag }) {
            const repo = this.db.getRepository(participationAG_1.ParticipationAG);
            const participationAGFound = yield repo.findOneBy({ id });
            if (participationAGFound === null)
                return null;
            if (user === undefined && ag === undefined) {
                return "No changes";
            }
            if (user) {
                participationAGFound.user = user;
            }
            if (ag) {
                participationAGFound.ag = ag;
            }
            const participationAGUpdate = yield repo.save(participationAGFound);
            return participationAGUpdate;
        });
    }
}
exports.ParticipationAGUsecase = ParticipationAGUsecase;
