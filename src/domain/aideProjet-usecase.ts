import { DataSource } from "typeorm";
import { AideProjet } from "../database/entities/aideProjet";

export interface ListAideProjetRequest {
    page: number
    limit: number
    nom?: string
    descriptionProjet?: string
    budget?: number
    deadline?: Date
}

export interface UpdateAideProjetParams {
    nom?: string
    descriptionProjet?: string
    budget?: number
    deadline?: Date
}

export class AideProjetUsecase {
    constructor(private readonly db: DataSource) { }

    async listAideProjets(listAideProjetRequest: ListAideProjetRequest): Promise<{ AideProjets: AideProjet[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(AideProjet, 'aideProjet');
        if (listAideProjetRequest.nom) {
            query.andWhere("aideProjet.nom = :nom", { nom: listAideProjetRequest.nom });
        }

        if (listAideProjetRequest.descriptionProjet) {
            query.andWhere("aideProjet.descriptionProjet = :descriptionProjet", { descriptionProjet: listAideProjetRequest.descriptionProjet });
        }

        if (listAideProjetRequest.budget) {
            query.andWhere("aideProjet.budget = :budget", { budget: listAideProjetRequest.budget });
        }

        if (listAideProjetRequest.deadline) {
            query.andWhere("aideProjet.deadline = :deadline", { deadline: listAideProjetRequest.deadline });
        }

        query.skip((listAideProjetRequest.page - 1) * listAideProjetRequest.limit)
            .take(listAideProjetRequest.limit);

        const [AideProjets, totalCount] = await query.getManyAndCount();
        return {
            AideProjets,
            totalCount
        };
    }

    async getOneAideProjet(id: number): Promise<AideProjet | null> {
        const query = this.db.createQueryBuilder(AideProjet, 'aideProjet')
            .where("aideProjet.id = :id", { id: id });

        const aideProjet = await query.getOne();

        if (!aideProjet) {
            console.log({ error: `AideProjet ${id} not found` });
            return null;
        }
        return aideProjet;
    }

    async updateAideProjet(id: number, { nom, descriptionProjet, budget, deadline }: UpdateAideProjetParams): Promise<AideProjet | string | null> {
        const repo = this.db.getRepository(AideProjet);
        const aideProjetFound = await repo.findOneBy({ id });
        if (aideProjetFound === null) return null;

        if (nom === undefined && descriptionProjet === undefined && budget === undefined && deadline === undefined) {
            return "No changes";
        }

        if (nom) {
            aideProjetFound.nom = nom;
        }
        if (descriptionProjet) {
            aideProjetFound.descriptionProjet = descriptionProjet;
        }
        if (budget) {
            aideProjetFound.budget = budget;
        }
        if (deadline) {
            aideProjetFound.deadline = deadline;
        }

        const aideProjetUpdate = await repo.save(aideProjetFound);
        return aideProjetUpdate;
    }
}
