import {DataSource, SelectQueryBuilder } from "typeorm";
import { Ressource, TypeRessource } from "../database/entities/ressource";
import { StatutTache } from "../database/entities/tache";
import { User } from "../database/entities/user";
import { Tache } from "../database/entities/tache";


export interface ListTacheRequest {
    page: number
    limit: number
    description?: string
    dateDebut?: Date;
    dateFin?: Date;
    statut?: StatutTache;
    responsable?: number
}



export interface UpdateTacheParams {
    id: number
    description?: string
    dateDebut?: Date;
    dateFin?: Date;
    statut?: StatutTache;
    responsable?: User
}


export class TacheUsecase {
    constructor(private readonly db: DataSource) { }

    async listShowtime(listTacheRequest: ListTacheRequest): Promise<{ Taches: Tache[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Tache, 'tache')
        if (listTacheRequest.dateDebut){
            query.andWhere("tache.dateDebut = :dateDebut", { dateDebut: listTacheRequest.dateDebut });
        }

        if(listTacheRequest.dateFin){
            query.andWhere("tache.dateFin = :dateFin", { dateFin: listTacheRequest.dateFin });
        }

        if(listTacheRequest.description){
            query.andWhere("tache.description = :description", { description: listTacheRequest.description });
        }

        if(listTacheRequest.responsable){
            query.andWhere("tache.responsable = :responsable", { responsable: listTacheRequest.responsable });
        }

        if(listTacheRequest.statut){
            query.andWhere("tache.statut = :statut", { statut: listTacheRequest.statut });
        }


        query.leftJoinAndSelect('tache.responsable', 'responsable')
        .skip((listTacheRequest.page - 1) * listTacheRequest.limit)
        .take(listTacheRequest.limit)

        const [Taches, totalCount] = await query.getManyAndCount()
        return {
            Taches,
            totalCount
        }
    }

    async getOneTache(id: number): Promise<Tache | null> {
        const query = this.db.createQueryBuilder(Tache, 'tache')
        query.leftJoinAndSelect('tache.responsable', 'responsable')
        .where("tache.id = :id", { id: id })


        const tache = await query.getOne();

        // Vérifier si le ticket existe
        if (!tache) {
            console.log({ error: `Tache ${id} not found` });
            return null;
        }
        return tache
    }

    async updateTache(id: number, { dateDebut,dateFin,description,statut,responsable }: UpdateTacheParams): Promise<Tache | string |null> {
        const repo = this.db.getRepository(Tache)
        const TacheFound = await repo.findOneBy({ id })
        if (TacheFound === null) return null

        if(dateDebut===undefined && dateFin===undefined && description===undefined && statut===undefined && responsable===undefined){
            return "No changes"
        }

        if (dateDebut) {
            TacheFound.dateDebut = dateDebut
        }
        if (dateFin) {
            TacheFound.dateFin = dateFin
        }
        if (description) {
            TacheFound.description = description
        }
        if (statut) {
            TacheFound.statut = statut
        }
        if (responsable) {
            TacheFound.responsable = responsable
        }

        const ShowtimeUpdate = await repo.save(TacheFound)
        return ShowtimeUpdate
    }
}