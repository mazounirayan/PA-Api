import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from "typeorm"
import "reflect-metadata"
import { User } from "./user"
import { Evenement } from "./evenement"


@Entity()
export class Inscription {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, user => user.transactions)
    user: User


    @ManyToOne(() => Evenement, evenement => evenement.transactions)
    evenement:Evenement

    
    constructor(id: number,user:User,evenement:Evenement) {
        this.id = id;
        this.user = user;
        this.evenement = evenement;
    }

}