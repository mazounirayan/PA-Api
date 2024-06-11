import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Token } from './token';
import { User } from './user';

@Entity()
export class Dossier {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @ManyToOne(() => Token, token => token.dossiers)
    token: Token;

    @ManyToOne(() => Dossier, dossier => dossier.enfants)
    dossier: Dossier;

    @OneToMany(() => Dossier, dossier => dossier.dossier)
    enfants: Dossier[];

    @ManyToOne(() => Token, user => user.dossiers)
    user: User;

    constructor(id :number ,nom: string, token: Token, dossier: Dossier, enfants: Dossier[], user: User) {
        this.id = id;
        this.nom = nom;
        this.token = token;
        this.dossier = dossier;
        this.enfants = enfants;
        this.user = user;
    }
}