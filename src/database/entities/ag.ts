import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ParticipationAG } from './participationAG';
import { Proposition } from './proposition';

@Entity()
export class Ag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    nom: string;

    @Column('datetime')
    date: Date;

    @Column()
    description: string;

    @Column({ length: 50 })
    type: string;

    @Column('int')
    quorum: number;

    @OneToMany(() => ParticipationAG, participationAG => participationAG.ag)
    participations: ParticipationAG[];

    @OneToMany(() => Proposition, proposition => proposition.ag)
    propositions: Proposition[];

    constructor(id:number, nom: string, date: Date, type: string, quorum: number, description: string, participations: ParticipationAG[], propositions: Proposition[]) {
        this.id = id;
        this.nom = nom;
        this.date = date;
        this.type = type;
        this.quorum = quorum;
        this.description = description;
        this.participations = participations;
        this.propositions = propositions;
    }
}
