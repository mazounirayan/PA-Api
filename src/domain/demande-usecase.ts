import { DataSource } from "typeorm";
import { Demande, StatutDemande, TypeDemande } from "../database/entities/demande";
import { User } from "../database/entities/user";


export interface ListDemandeRequest {
    page: number
    limit: number
    type?: string
    dateDemande?: Date
    statut?: string
    user?: number
}

export interface UpdateDemandeParams {
    type?: TypeDemande
    dateDemande?: Date
    statut?: StatutDemande
    user?: User
}

export class DemandeUsecase {
    constructor(private readonly db: DataSource) { }

    async listDemandes(listDemandeRequest: ListDemandeRequest): Promise<{ Demandes: Demande[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Demande, 'demande');
        if (listDemandeRequest.type) {
            query.andWhere("demande.type = :type", { type: listDemandeRequest.type });
        }

        if (listDemandeRequest.dateDemande) {
            query.andWhere("demande.dateDemande = :dateDemande", { dateDemande: listDemandeRequest.dateDemande });
        }

        if (listDemandeRequest.statut) {
            query.andWhere("demande.statut = :statut", { statut: listDemandeRequest.statut });
        }

        if (listDemandeRequest.user) {
            query.andWhere("demande.userId = :user", { user: listDemandeRequest.user });
        }

        query.leftJoinAndSelect('demande.user', 'user')
            .leftJoinAndSelect('demande.evenementDemandes', 'evenementDemandes')
            .leftJoinAndSelect('demande.aideProjetDemandes', 'aideProjetDemandes')
            .leftJoinAndSelect('demande.parrainageDemandes', 'parrainageDemandes')
            .skip((listDemandeRequest.page - 1) * listDemandeRequest.limit)
            .take(listDemandeRequest.limit);

        const [Demandes, totalCount] = await query.getManyAndCount();
        return {
            Demandes,
            totalCount
        };
    }

    async getOneDemande(id: number): Promise<Demande | null> {
        const query = this.db.createQueryBuilder(Demande, 'demande')
            .leftJoinAndSelect('demande.user', 'user')
            .leftJoinAndSelect('demande.evenementDemandes', 'evenementDemandes')
            .leftJoinAndSelect('demande.aideProjetDemandes', 'aideProjetDemandes')
            .leftJoinAndSelect('demande.parrainageDemandes', 'parrainageDemandes')
            .where("demande.id = :id", { id: id });

        const demande = await query.getOne();

        if (!demande) {
            console.log({ error: `Demande ${id} not found` });
            return null;
        }
        return demande;
    }

    async updateDemande(id: number, { type, dateDemande, statut, user }: UpdateDemandeParams): Promise<Demande | string | null> {
        const repo = this.db.getRepository(Demande);
        const demandeFound = await repo.findOneBy({ id });
        if (demandeFound === null) return null;

        if (type === undefined && dateDemande === undefined && statut === undefined && user === undefined) {
            return "No changes";
        }

        if (type) {
            demandeFound.type = type;
        }
        if (dateDemande) {
            demandeFound.dateDemande = dateDemande;
        }
        if (statut) {
            demandeFound.statut = statut;
        }
        if (user) {
            demandeFound.user = user;
        }

        const demandeUpdate = await repo.save(demandeFound);
        return demandeUpdate;
    }
}
