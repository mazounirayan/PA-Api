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
exports.EvenementUserUsecase = void 0;
const evenementUser_1 = require("../database/entities/evenementUser");
class EvenementUserUsecase {
    constructor(db) {
        this.db = db;
    }
    listEvenementUsers(listEvenementUserRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(evenementUser_1.EvenementUser, 'evenementUser');
            if (listEvenementUserRequest.evenement) {
                query.andWhere("evenementUser.evenementId = :evenement", { evenement: listEvenementUserRequest.evenement });
            }
            if (listEvenementUserRequest.user) {
                query.andWhere("evenementUser.userId = :user", { user: listEvenementUserRequest.user });
            }
            query.leftJoinAndSelect('evenementUser.evenement', 'evenement')
                .leftJoinAndSelect('evenementUser.user', 'user')
                .skip((listEvenementUserRequest.page - 1) * listEvenementUserRequest.limit)
                .take(listEvenementUserRequest.limit);
            const [EvenementUsers, totalCount] = yield query.getManyAndCount();
            return {
                EvenementUsers,
                totalCount
            };
        });
    }
    getOneEvenementUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(evenementUser_1.EvenementUser, 'evenementUser')
                .leftJoinAndSelect('evenementUser.evenement', 'evenement')
                .leftJoinAndSelect('evenementUser.user', 'user')
                .where("evenementUser.id = :id", { id: id });
            const evenementUser = yield query.getOne();
            if (!evenementUser) {
                console.log({ error: `EvenementUser ${id} not found` });
                return null;
            }
            return evenementUser;
        });
    }
    updateEvenementUser(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { evenement, user }) {
            const repo = this.db.getRepository(evenementUser_1.EvenementUser);
            const evenementUserFound = yield repo.findOneBy({ id });
            if (evenementUserFound === null)
                return null;
            if (evenement === undefined && user === undefined) {
                return "No changes";
            }
            if (evenement) {
                evenementUserFound.evenement = evenement;
            }
            if (user) {
                evenementUserFound.user = user;
            }
            const evenementUserUpdate = yield repo.save(evenementUserFound);
            return evenementUserUpdate;
        });
    }
}
exports.EvenementUserUsecase = EvenementUserUsecase;
