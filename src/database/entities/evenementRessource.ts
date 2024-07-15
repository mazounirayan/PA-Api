import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Evenement } from "./evenement";
import { User } from "./user";
import { Ressource } from "./ressource";

@Entity()
export class EvenementRessource {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Evenement, evenement => evenement.evenementUsers)
    evenement: Evenement;

    @ManyToOne(() => Ressource, ressource => ressource.evenementUsers)
    ressource: Ressource;

    constructor(id:number, evenement: Evenement, ressource: Ressource) {
        this.id = id;
        this.evenement = evenement;
        this.ressource = ressource;
    }
}
