import {DataSource } from "typeorm";
import { Ressource } from "../database/entities/ressource";
import { Reservation } from "../database/entities/reservation";
import { User } from "../database/entities/user";


export interface ListReservationRequest {
    page: number
    limit: number
    dateDebut?: Date;
    dateFin?: Date;
    description?: string
    ressource?: number
    user?: number
}



export interface UpdateReservationParams {
    dateDebut?: Date;
    dateFin?: Date;
    description?: string
    ressource?: Ressource
    user?: User
}


export class ReservationUsecase {
    constructor(private readonly db: DataSource) { }

    async listShowtime(listReservationRequest: ListReservationRequest): Promise<{ Reservations: Reservation[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Reservation, 'reservation')
        if (listReservationRequest.dateDebut){
            query.andWhere("reservation.dateDebut = :dateDebut", { dateDebut: listReservationRequest.dateDebut });
        }

        if(listReservationRequest.dateFin){
            query.andWhere("reservation.dateFin = :dateFin", { dateFin: listReservationRequest.dateFin });
        }

        if(listReservationRequest.description){
            query.andWhere("reservation.description = :description", { description: listReservationRequest.description });
        }

        if(listReservationRequest.ressource){
            query.andWhere("reservation.ressourceId = :ressource", { ressource: listReservationRequest.ressource });
        }

        if(listReservationRequest.user){
            query.andWhere("reservation.userId = :user", { user: listReservationRequest.user });
        }


        query.leftJoinAndSelect('reservation.ressource', 'ressource')
        .leftJoinAndSelect('reservation.user', 'user')
        .skip((listReservationRequest.page - 1) * listReservationRequest.limit)
        .take(listReservationRequest.limit)

        const [Reservations, totalCount] = await query.getManyAndCount()
        return {
            Reservations,
            totalCount
        }
    }

    async getOneReservation(id: number): Promise<Reservation | null> {
        const query = this.db.createQueryBuilder(Reservation, 'reservation')
        .leftJoinAndSelect('reservation.ressource', 'ressource')
        .leftJoinAndSelect('reservation.user', 'user')
        .where("reservation.id = :id", { id: id })


        const reservation = await query.getOne();

        // Vérifier si le ticket existe
        if (!reservation) {
            console.log({ error: `Reservation ${id} not found` });
            return null;
        }
        return reservation
    }

    async updateRessource(id: number, { dateDebut,dateFin,description,ressource,user }: UpdateReservationParams): Promise<Reservation | string |null> {
        const repo = this.db.getRepository(Reservation)
        const Reservationfound = await repo.findOneBy({ id })
        if (Reservationfound === null) return null

        if(dateDebut===undefined && dateFin===undefined && description===undefined && ressource===undefined && user===undefined){
            return "No changes"
        }

        if (dateDebut) {
            Reservationfound.dateDebut = dateDebut
        }
        if (dateFin) {
            Reservationfound.dateFin = dateFin
        }
        if (description) {
            Reservationfound.description = description
        }
        if (ressource) {
            Reservationfound.ressource = ressource
        }
        if (user) {
            Reservationfound.user = user
        }

        const ShowtimeUpdate = await repo.save(Reservationfound)
        return ShowtimeUpdate
    }
}