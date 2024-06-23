import { DataSource } from "typeorm"
import { AutreDemande } from "../database/entities/autreDemande"
import { Demande } from "../database/entities/demande"

export interface ListAutreDemandeRequest {
    page: number
    limit: number
    titre?: string
    description?: string
    demande?: number
}

export interface UpdateAutreDemandeParams {
    titre?: string
    description?: string
    demande?: Demande
}

export class AutreDemandeUsecase {
    constructor(private readonly db: DataSource) { }

    async listAutreDemandes(listAutreDemandeRequest: ListAutreDemandeRequest): Promise<{ AutreDemandes: AutreDemande[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(AutreDemande, 'autreDemande');
        if (listAutreDemandeRequest.titre) {
            query.andWhere("autreDemande.titre = :titre", { titre: listAutreDemandeRequest.titre });
        }

        if (listAutreDemandeRequest.description) {
            query.andWhere("autreDemande.description = :description", { description: listAutreDemandeRequest.description });
        }

        if (listAutreDemandeRequest.demande) {
            query.andWhere("autreDemande.demandeId = :demande", { demande: listAutreDemandeRequest.demande });
        }

        query.leftJoinAndSelect('autreDemande.demande', 'demande')
            .skip((listAutreDemandeRequest.page - 1) * listAutreDemandeRequest.limit)
            .take(listAutreDemandeRequest.limit);

        const [AutreDemandes, totalCount] = await query.getManyAndCount();
        return {
            AutreDemandes,
            totalCount
        };
    }

    async getOneAutreDemande(id: number): Promise<AutreDemande | null> {
        const query = this.db.createQueryBuilder(AutreDemande, 'autreDemande')
            .leftJoinAndSelect('autreDemande.demande', 'demande')
            .where("autreDemande.id = :id", { id: id });

        const autreDemande = await query.getOne();

        if (!autreDemande) {
            console.log({ error: `AutreDemande ${id} not found` });
            return null;
        }
        return autreDemande;
    }

    async updateAutreDemande(id: number, { titre, description, demande }: UpdateAutreDemandeParams): Promise<AutreDemande | string | null> {
        const repo = this.db.getRepository(AutreDemande);
        const autreDemandeFound = await repo.findOneBy({ id });
        if (autreDemandeFound === null) return null;

        if (titre === undefined && description === undefined && demande === undefined) {
            return "No changes";
        }

        if (titre) {
            autreDemandeFound.titre = titre;
        }
        if (description) {
            autreDemandeFound.description = description;
        }
        if (demande) {
            autreDemandeFound.demande = demande;
        }

        const autreDemandeUpdate = await repo.save(autreDemandeFound);
        return autreDemandeUpdate;
    }
}