import { DataSource } from "typeorm";
import { User } from "../database/entities/user";
import { Demande } from "../database/entities/demande";
import { ParrainageDemande } from "../database/entities/parrainageDemande";

export interface ListParrainageDemandeRequest {
    page: number
    limit: number
    detailsParrainage?: string
    parrain?: number
    demande?: number
}

export interface UpdateParrainageDemandeParams {
    detailsParrainage?: string
    parrain?: User
    demande?: Demande
}

export class ParrainageDemandeUsecase {
    constructor(private readonly db: DataSource) { }

    async listParrainageDemandes(listParrainageDemandeRequest: ListParrainageDemandeRequest): Promise<{ ParrainageDemandes: ParrainageDemande[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(ParrainageDemande, 'parrainageDemande');
        if (listParrainageDemandeRequest.detailsParrainage) {
            query.andWhere("parrainageDemande.detailsParrainage = :detailsParrainage", { detailsParrainage: listParrainageDemandeRequest.detailsParrainage });
        }

        if (listParrainageDemandeRequest.parrain) {
            query.andWhere("parrainageDemande.parrainId = :parrain", { parrain: listParrainageDemandeRequest.parrain });
        }

        if (listParrainageDemandeRequest.demande) {
            query.andWhere("parrainageDemande.demandeId = :demande", { demande: listParrainageDemandeRequest.demande });
        }

        query.leftJoinAndSelect('parrainageDemande.parrain', 'parrain')
            .leftJoinAndSelect('parrainageDemande.demande', 'demande')
            .skip((listParrainageDemandeRequest.page - 1) * listParrainageDemandeRequest.limit)
            .take(listParrainageDemandeRequest.limit);

        const [ParrainageDemandes, totalCount] = await query.getManyAndCount();
        return {
            ParrainageDemandes,
            totalCount
        };
    }

    async getOneParrainageDemande(id: number): Promise<ParrainageDemande | null> {
        const query = this.db.createQueryBuilder(ParrainageDemande, 'parrainageDemande')
            .leftJoinAndSelect('parrainageDemande.parrain', 'parrain')
            .leftJoinAndSelect('parrainageDemande.demande', 'demande')
            .where("parrainageDemande.id = :id", { id: id });

        const parrainageDemande = await query.getOne();

        if (!parrainageDemande) {
            console.log({ error: `ParrainageDemande ${id} not found` });
            return null;
        }
        return parrainageDemande;
    }

    async updateParrainageDemande(id: number, { detailsParrainage, parrain, demande }: UpdateParrainageDemandeParams): Promise<ParrainageDemande | string | null> {
        const repo = this.db.getRepository(ParrainageDemande);
        const parrainageDemandeFound = await repo.findOneBy({ id });
        if (parrainageDemandeFound === null) return null;

        if (detailsParrainage === undefined && parrain === undefined && demande === undefined) {
            return "No changes";
        }

        if (detailsParrainage) {
            parrainageDemandeFound.detailsParrainage = detailsParrainage;
        }
        if (parrain) {
            parrainageDemandeFound.parrain = parrain;
        }
        if (demande) {
            parrainageDemandeFound.demande = demande;
        }

        const parrainageDemandeUpdate = await repo.save(parrainageDemandeFound);
        return parrainageDemandeUpdate;
    }
}
