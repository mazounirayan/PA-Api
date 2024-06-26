import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Demande } from "./demande";



@Entity()
export class EvenementDemande {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titre: string;


    @Column()
    date: Date;

    @Column()
    description: string;

    @Column()
    lieu: string

    @ManyToOne(() => Demande, demande => demande.evenementDemandes)
    demande: Demande;

    constructor(id: number, nom: string,date :Date,description:string, lieu:string ,demande: Demande) {
        this.id = id
        this.titre = nom
        this.date = date
        this.description = description
        this.lieu = lieu
        this.demande = demande
    }
}