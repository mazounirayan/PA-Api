import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Demande } from "./demande";



@Entity()
export class AutreDemande {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titre: string;

    @Column()
    description: string;

    @ManyToOne(() => Demande, demande => demande.autreDemandes)
    demande: Demande;

    constructor(id: number, titre:string ,description:string, demande: Demande) {
        this.id = id
        this.titre = titre
        this.description = description
        this.demande = demande
    }
}