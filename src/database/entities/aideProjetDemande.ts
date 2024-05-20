import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Demande } from "./demande";



@Entity()
export class AideProjetDemande {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;


    @Column()
    descriptionProjet: string;

    @Column()
    budget: number

    @Column()
    deadline: Date;

    @ManyToOne(() => Demande, demande => demande.aideProjetDemandes)
    demande: Demande;

    constructor(id: number, nom: string, descriptionProjet:string, budget:number, deadline:Date ,demande: Demande) {
        this.id = id
        this.nom = nom
        this.descriptionProjet = descriptionProjet
        this.budget = budget
        this.deadline = deadline
        this.demande = demande
    }
}