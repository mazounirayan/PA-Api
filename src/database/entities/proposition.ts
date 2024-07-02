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

    @Column()
    question: string;

    @Column()
    type: TypeProposition;

    @Column("simple-array")  // Utilisation de "simple-array" pour TypeORM
    choix: string[];

    @ManyToOne(() => Ag, ag => ag.propositions)
    ag: Ag;

    @ManyToOne(() => Sondage, sondage => sondage.propositions)
    sondage: Sondage;

    @OneToMany(() => Vote, vote => vote.proposition)
    votes: Vote[];

    constructor(id: number, question: string, choix: string[], type: TypeProposition, ag: Ag, sondage: Sondage, votes: Vote[]) {
        this.id = id;
        this.question = question;
        this.type = type;
        this.choix = choix
        this.ag = ag;
        this.sondage = sondage;
        this.votes = votes;
    }
}
