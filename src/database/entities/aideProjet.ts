import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AideProjet {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column()
    descriptionProjet: string;

    @Column()
    budget: number;

    @Column()
    deadline: Date;

    constructor(id: number, nom: string, descriptionProjet: string, budget: number, deadline: Date) {
        this.id = id;
        this.nom = nom;
        this.descriptionProjet = descriptionProjet;
        this.budget = budget;
        this.deadline = deadline;
    }
}
