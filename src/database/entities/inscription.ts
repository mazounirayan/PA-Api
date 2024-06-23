import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import "reflect-metadata"
import { Evenement } from "./evenement"


@Entity()
export class Inscription {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    emailVisiteur: string


    @ManyToOne(() => Evenement, evenement => evenement.transactions)
    evenement:Evenement

    
    constructor(id: number,emailVisiteur:string,evenement:Evenement) {
        this.id = id;
        this.emailVisiteur = emailVisiteur;
        this.evenement = evenement;
    }
}