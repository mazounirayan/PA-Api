import { DataSource } from "typeorm";
import { Ressource, TypeRessource } from "../database/entities/ressource";

export interface ListRessourceRequest {
    page: number
    limit: number
    nom?: string
    type?: TypeRessource
    quantite?: number
    emplacement?: string
}

export interface UpdateRessourceParams {
    nom?: string
    type?: TypeRessource
    quantite?: number
    emplacement?: string
}

export class RessourceUsecase {
    constructor(private readonly db: DataSource) { }

    async listRessources(listRessourceRequest: ListRessourceRequest): Promise<{ Ressources: Ressource[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Ressource, 'ressource');
        if (listRessourceRequest.nom) {
            query.andWhere("ressource.nom = :nom", { nom: listRessourceRequest.nom });
        }

        if (listRessourceRequest.type) {
            query.andWhere("ressource.type = :type", { type: listRessourceRequest.type });
        }

        if (listRessourceRequest.quantite) {
            query.andWhere("ressource.quantite = :quantite", { quantite: listRessourceRequest.quantite });
        }

        if (listRessourceRequest.emplacement) {
            query.andWhere("ressource.emplacement = :emplacement", { emplacement: listRessourceRequest.emplacement });
        }

        query.leftJoinAndSelect('ressource.evenementRessources', 'evenementRessources')
            .leftJoinAndSelect('ressource.evenementUsers', 'evenementUsers')
            .skip((listRessourceRequest.page - 1) * listRessourceRequest.limit)
            .take(listRessourceRequest.limit);

        const [Ressources, totalCount] = await query.getManyAndCount();
        return {
            Ressources,
            totalCount
        };
    }

    async getOneRessource(id: number): Promise<Ressource | null> {
        const query = this.db.createQueryBuilder(Ressource, 'ressource')
            .leftJoinAndSelect('ressource.evenementRessources', 'evenementRessources')
            .leftJoinAndSelect('ressource.evenementUsers', 'evenementUsers')
            .where("ressource.id = :id", { id: id });

        const ressource = await query.getOne();

        if (!ressource) {
            console.log({ error: `Ressource ${id} not found` });
            return null;
        }
        return ressource;
    }

    async updateRessource(id: number, { nom, type, quantite, emplacement }: UpdateRessourceParams): Promise<Ressource | string | null> {
        const repo = this.db.getRepository(Ressource);
        const ressourceFound = await repo.findOneBy({ id });
        if (ressourceFound === null) return null;

        if (nom === undefined && type === undefined && quantite === undefined && emplacement === undefined) {
            return "No changes";
        }

        if (nom) {
            ressourceFound.nom = nom;
        }
        if (type) {
            ressourceFound.type = type;
        }
        if (quantite !== undefined) {
            ressourceFound.quantite = quantite;
        }
        if (emplacement) {
            ressourceFound.emplacement = emplacement;
        }

        const ressourceUpdate = await repo.save(ressourceFound);
        return ressourceUpdate;
    }
}
