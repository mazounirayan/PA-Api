import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Demande } from "./demande";



@Entity()
export class ParrainageDemande {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    detailsParrainage: string;

    @ManyToOne(() => User, parrain => parrain.parrainageDemandes)
    parrain: User;

    @ManyToOne(() => Demande, demande => demande.parrainageDemandes)
    demande: Demande;

    constructor(id: number, detailsParrainage: string, parrain:User ,demande: Demande) {
        this.id = id
        this.detailsParrainage = detailsParrainage
        this.parrain = parrain
        this.demande = demande
    }
}