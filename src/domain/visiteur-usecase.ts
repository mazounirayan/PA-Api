import { DataSource } from "typeorm"
import { Visiteur } from "../database/entities/visiteur"
import { User } from "../database/entities/user"

export interface ListVisiteurRequest {
    page: number
    limit: number
    email?: string
    nom?: string
    prenom?: string
    age?: number
    numTel?: string
    adresse?: string
    profession?: string
    dateInscription?: Date
    estBenevole?: boolean
    parrain?: number
}

export interface UpdateVisiteurParams {
    email?: string
    nom?: string
    prenom?: string
    age?: number
    numTel?: string
    adresse?: string
    profession?: string
    dateInscription?: Date
    estBenevole?: boolean
    parrain?: User
}

export class VisiteurUsecase {
    constructor(private readonly db: DataSource) { }

    async listVisiteurs(listVisiteurRequest: ListVisiteurRequest): Promise<{ Visiteurs: Visiteur[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Visiteur, 'visiteur');
        if (listVisiteurRequest.email) {
            query.andWhere("visiteur.email = :email", { email: listVisiteurRequest.email });
        }

        if (listVisiteurRequest.nom) {
            query.andWhere("visiteur.nom = :nom", { nom: listVisiteurRequest.nom });
        }

        if (listVisiteurRequest.prenom) {
            query.andWhere("visiteur.prenom = :prenom", { prenom: listVisiteurRequest.prenom });
        }

        if (listVisiteurRequest.age) {
            query.andWhere("visiteur.age = :age", { age: listVisiteurRequest.age });
        }

        if (listVisiteurRequest.numTel) {
            query.andWhere("visiteur.numTel = :numTel", { numTel: listVisiteurRequest.numTel });
        }

        if (listVisiteurRequest.adresse) {
            query.andWhere("visiteur.adresse = :adresse", { adresse: listVisiteurRequest.adresse });
        }

        if (listVisiteurRequest.profession) {
            query.andWhere("visiteur.profession = :profession", { profession: listVisiteurRequest.profession });
        }

        if (listVisiteurRequest.dateInscription) {
            query.andWhere("visiteur.dateInscription = :dateInscription", { dateInscription: listVisiteurRequest.dateInscription });
        }

        if (listVisiteurRequest.estBenevole !== undefined) {
            query.andWhere("visiteur.estBenevole = :estBenevole", { estBenevole: listVisiteurRequest.estBenevole });
        }

        if (listVisiteurRequest.parrain) {
            query.andWhere("visiteur.parrainId = :parrain", { parrain: listVisiteurRequest.parrain });
        }

        query.leftJoinAndSelect('visiteur.parrain', 'parrain')
            .skip((listVisiteurRequest.page - 1) * listVisiteurRequest.limit)
            .take(listVisiteurRequest.limit);

        const [Visiteurs, totalCount] = await query.getManyAndCount();
        return {
            Visiteurs,
            totalCount
        };
    }

    async getOneVisiteur(email: string): Promise<Visiteur | null> {
        const query = this.db.createQueryBuilder(Visiteur, 'visiteur')
            .leftJoinAndSelect('visiteur.parrain', 'parrain')
            .where("visiteur.email = :email", { email: email });

        const visiteur = await query.getOne();

        if (!visiteur) {
            console.log({ error: `Visiteur ${email} not found` });
            return null;
        }
        return visiteur;
    }

    async updateVisiteur(email: string, { nom, prenom, age, numTel, adresse, profession, dateInscription, estBenevole, parrain }: UpdateVisiteurParams): Promise<Visiteur | string | null> {
        const repo = this.db.getRepository(Visiteur);
        const visiteurFound = await repo.findOneBy({ email });
        if (visiteurFound === null) return null;

        if (nom === undefined && prenom === undefined && age === undefined && numTel === undefined && adresse === undefined && profession === undefined && dateInscription === undefined && estBenevole === undefined && parrain === undefined) {
            return "No changes";
        }

        if (nom) {
            visiteurFound.nom = nom;
        }
        if (prenom) {
            visiteurFound.prenom = prenom;
        }
        if (age !== undefined) {
            visiteurFound.age = age;
        }
        if (numTel) {
            visiteurFound.numTel = numTel;
        }
        if (adresse) {
            visiteurFound.adresse = adresse;
        }
        if (profession) {
            visiteurFound.profession = profession;
        }
        if (dateInscription) {
            visiteurFound.dateInscription = dateInscription;
        }
        if (estBenevole !== undefined) {
            visiteurFound.estBenevole = estBenevole;
        }
        if (parrain) {
            visiteurFound.parrain = parrain;
        }

        const visiteurUpdate = await repo.save(visiteurFound);
        return visiteurUpdate;
    }
}