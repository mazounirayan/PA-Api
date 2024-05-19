import {DataSource, SelectQueryBuilder } from "typeorm";
import { Ressource, TypeRessource, TypeStatut } from "../database/entities/ressource";


export interface ListRessourceRequest {
    page: number
    limit: number
    nom?: string
    type?: string;
    statut?: string;
    emplacement?: string
}



export interface UpdateRessourceParams {
    nom?: string
    type?: TypeRessource;
    statut?: TypeStatut;
    emplacement?: string
}


export class RessourceUsecase {
    constructor(private readonly db: DataSource) { }

    async listShowtime(listRessourceFilter: ListRessourceRequest): Promise<{ Ressources: Ressource[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Ressource, 'ressource')
        if (listRessourceFilter.nom) {
            query.andWhere('ressource.salle <= :salle', { salle: listRessourceFilter.nom })
        }

        if(listRessourceFilter.type){
            query.andWhere('ressource.type <= :type', { type: listRessourceFilter.type })
        }

        if(listRessourceFilter.statut){
            query.andWhere('ressource.status <= :status', { status: listRessourceFilter.statut })
        }

        if(listRessourceFilter.emplacement){
            query.andWhere('ressource.emplacement <= :emplacement', { emplacement: listRessourceFilter.emplacement })
        }


        query.skip((listRessourceFilter.page - 1) * listRessourceFilter.limit)
        .take(listRessourceFilter.limit)

        const [Ressources, totalCount] = await query.getManyAndCount()
        return {
            Ressources,
            totalCount
        }
    }

    async getOneRessource(id: number): Promise<Ressource | null> {
        const query = this.db.createQueryBuilder(Ressource, 'ressource')
        .where("ressource.id = :id", { id: id });

        const ressource = await query.getOne();

        // Vérifier si le ticket existe
        if (!ressource) {
            console.log({ error: `Ticket ${id} not found` });
            return null;
        }
        return ressource
    }

    async updateRessource(id: number, { nom,type,statut,emplacement }: UpdateRessourceParams): Promise<Ressource | string |null> {
        const repo = this.db.getRepository(Ressource)
        const Ressourcefound = await repo.findOneBy({ id })
        if (Ressourcefound === null) return null

        if(nom === undefined && type === undefined && statut === undefined && emplacement === undefined){
            return "No update provided"
        }

        if (nom) {
            Ressourcefound.nom = nom
        }
        if (type) {
            Ressourcefound.type = type
        }
        if (statut) {
            Ressourcefound.statut = statut
        }
        if (emplacement) {
            Ressourcefound.emplacement = emplacement
        }

        const ShowtimeUpdate = await repo.save(Ressourcefound)
        return ShowtimeUpdate
    }
}