import { DataSource } from "typeorm";
import { EvenementRessource } from "../database/entities/evenementRessource";
import { Evenement } from "../database/entities/evenement";
import { Ressource } from "../database/entities/ressource";

export interface ListEvenementRessourceRequest {
    page: number
    limit: number
    evenement?: number
    ressource?: number
}

export interface UpdateEvenementRessourceParams {
    evenement?: Evenement
    ressource?: Ressource
}

export class EvenementRessourceUsecase {
    constructor(private readonly db: DataSource) { }

    async listEvenementRessources(listEvenementRessourceRequest: ListEvenementRessourceRequest): Promise<{ EvenementRessources: EvenementRessource[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(EvenementRessource, 'evenementRessource');
        if (listEvenementRessourceRequest.evenement) {
            query.andWhere("evenementRessource.evenementId = :evenement", { evenement: listEvenementRessourceRequest.evenement });
        }

        if (listEvenementRessourceRequest.ressource) {
            query.andWhere("evenementRessource.ressourceId = :ressource", { ressource: listEvenementRessourceRequest.ressource });
        }

        query.leftJoinAndSelect('evenementRessource.evenement', 'evenement')
            .leftJoinAndSelect('evenementRessource.ressource', 'ressource')
            .skip((listEvenementRessourceRequest.page - 1) * listEvenementRessourceRequest.limit)
            .take(listEvenementRessourceRequest.limit);

        const [EvenementRessources, totalCount] = await query.getManyAndCount();
        return {
            EvenementRessources,
            totalCount
        };
    }

    async getOneEvenementRessource(id: number): Promise<EvenementRessource | null> {
        const query = this.db.createQueryBuilder(EvenementRessource, 'evenementRessource')
            .leftJoinAndSelect('evenementRessource.evenement', 'evenement')
            .leftJoinAndSelect('evenementRessource.ressource', 'ressource')
            .where("evenementRessource.id = :id", { id: id });

        const evenementRessource = await query.getOne();

        if (!evenementRessource) {
            console.log({ error: `EvenementRessource ${id} not found` });
            return null;
        }
        return evenementRessource;
    }

    async updateEvenementRessource(id: number, { evenement, ressource }: UpdateEvenementRessourceParams): Promise<EvenementRessource | string | null> {
        const repo = this.db.getRepository(EvenementRessource);
        const evenementRessourceFound = await repo.findOneBy({ id });
        if (evenementRessourceFound === null) return null;

        if (evenement === undefined && ressource === undefined) {
            return "No changes";
        }

        if (evenement) {
            evenementRessourceFound.evenement = evenement;
        }
        if (ressource) {
            evenementRessourceFound.ressource = ressource;
        }

        const evenementRessourceUpdate = await repo.save(evenementRessourceFound);
        return evenementRessourceUpdate;
    }
}
