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
exports.ReservationUsecase = void 0;
const reservation_1 = require("../database/entities/reservation");
class ReservationUsecase {
    constructor(db) {
        this.db = db;
    }
    listShowtime(listReservationRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(reservation_1.Reservation, 'reservation');
            if (listReservationRequest.dateDebut) {
                query.andWhere("reservation.dateDebut = :dateDebut", { dateDebut: listReservationRequest.dateDebut });
            }
            if (listReservationRequest.dateFin) {
                query.andWhere("reservation.dateFin = :dateFin", { dateFin: listReservationRequest.dateFin });
            }
            if (listReservationRequest.description) {
                query.andWhere("reservation.description = :description", { description: listReservationRequest.description });
            }
            if (listReservationRequest.ressource) {
                query.andWhere("reservation.ressourceId = :ressource", { ressource: listReservationRequest.ressource });
            }
            if (listReservationRequest.user) {
                query.andWhere("reservation.userId = :user", { user: listReservationRequest.user });
            }
            query.leftJoinAndSelect('reservation.ressource', 'ressource')
                .leftJoinAndSelect('reservation.user', 'user')
                .skip((listReservationRequest.page - 1) * listReservationRequest.limit)
                .take(listReservationRequest.limit);
            const [Reservations, totalCount] = yield query.getManyAndCount();
            return {
                Reservations,
                totalCount
            };
        });
    }
    getOneReservation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(reservation_1.Reservation, 'reservation')
                .leftJoinAndSelect('reservation.ressource', 'ressource')
                .leftJoinAndSelect('reservation.user', 'user')
                .where("reservation.id = :id", { id: id });
            const reservation = yield query.getOne();
            // Vérifier si le ticket existe
            if (!reservation) {
                console.log({ error: `Reservation ${id} not found` });
                return null;
            }
            return reservation;
        });
    }
    updateRessource(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { dateDebut, dateFin, description, ressource, user }) {
            const repo = this.db.getRepository(reservation_1.Reservation);
            const Reservationfound = yield repo.findOneBy({ id });
            if (Reservationfound === null)
                return null;
            if (dateDebut === undefined && dateFin === undefined && description === undefined && ressource === undefined && user === undefined) {
                return "No changes";
            }
            if (dateDebut) {
                Reservationfound.dateDebut = dateDebut;
            }
            if (dateFin) {
                Reservationfound.dateFin = dateFin;
            }
            if (description) {
                Reservationfound.description = description;
            }
            if (ressource) {
            }
            const ShowtimeUpdate = yield repo.save(Reservationfound);
            return ShowtimeUpdate;
        });
    }
}
exports.ReservationUsecase = ReservationUsecase;
