import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Evenement } from "./evenement";
import { User } from "./user";

@Entity()
export class EvenementUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Evenement, evenement => evenement.evenementUsers)
    evenement: Evenement;

    @ManyToOne(() => User, user => user.evenementUsers)
    user: User;

    constructor(id:number, evenement: Evenement, user: User) {
        this.id = id;
        this.evenement = evenement;
        this.user = user;
    }
}
