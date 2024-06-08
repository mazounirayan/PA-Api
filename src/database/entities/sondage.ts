import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Proposition } from './proposition';

@Entity()
export class Sondage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    nom: string;

    @Column('datetime')
    date: Date;

    @Column('text')
    description: string;

    @Column({ length: 50, nullable: true })
    type: string;

    @OneToMany(() => Proposition, proposition => proposition.sondage)
    propositions: Proposition[];

    constructor(id:number,nom: string, date: Date, description: string, type: string, propositions:Proposition[]) {
        this.id = id;
        this.nom = nom;
        this.date = date;
        this.description = description;
        this.type = type;
        this.propositions = propositions
    }
}
