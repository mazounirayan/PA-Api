import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Ag } from './ag';
import { Sondage } from './sondage';
import { Vote } from './vote';

export enum TypeProposition {
    Checkbox = "checkbox",
    Radio = "radio",
    Text = "text"
}

@Entity()
export class Proposition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    description: string;

    @Column()
    type: TypeProposition;


    @ManyToOne(() => Ag, ag => ag.propositions)
    ag: Ag;

    @ManyToOne(() => Sondage, sondage => sondage.propositions)
    sondage: Sondage;

    @OneToMany(() => Vote, vote => vote.proposition)
    votes: Vote[];

    constructor(id:number,description: string, type: TypeProposition, ag: Ag, sondage: Sondage, votes: Vote[]) {
        this.id = id;
        this.description = description;
        this.type = type;
        this.ag = ag;
        this.sondage = sondage;
        this.votes = votes;
    }
}
