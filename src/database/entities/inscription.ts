import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from "typeorm"
import "reflect-metadata"
import { User } from "./user"
import { Evenement } from "./evenement"
import { Visiteur } from "./visiteur"


@Entity()
export class Inscription {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Visiteur, visiteur => visiteur.transactions)
    visiteur: Visiteur


    @ManyToOne(() => Evenement, evenement => evenement.transactions)
    evenement:Evenement

    
    constructor(id: number,visiteur:Visiteur,evenement:Evenement) {
        this.id = id;
        this.visiteur = visiteur;
        this.evenement = evenement;
    }

}