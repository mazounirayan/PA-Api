import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne} from "typeorm"
import { Token } from "./token"
import "reflect-metadata"
import { Transaction } from "./transaction"
import { Tache } from "./tache"
import { Reservation } from "./reservation"
import { Demande } from "./demande"
import { EvenementDemande } from "./evenementDemande"
import { ParrainageDemande } from "./parrainageDemande"

export enum UserRole {
    Visiteur = "Visiteur",
    Administrateur = "Administrateur",
    Adherent = "Adherent"
}


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nom: string

    @Column()
    prenom: string

    @Column({
        unique: true
    })
    email: string

    @Column()
    motDePasse: string

    @Column({
        type: "enum",
        enum: UserRole,
    })
    role: UserRole;

    @Column()
    @CreateDateColumn({type: "datetime"})
    dateInscription: Date

    @Column()
    estBenevole: boolean

    @ManyToOne(() => User, user => user.parraine)
    parrain: User;

    @OneToMany(() => Transaction, transactions => transactions.user)
    transactions: Transaction[];

    @OneToMany(() => Tache, tache => tache.responsable)
    taches: Tache[];

    @OneToMany(() => Reservation, reservation => reservation.user)
    reservations: Reservation[];

    @OneToMany(() => User, users => users.parrain)
    parraine: User[];

    @OneToMany(() => Token, token => token.user)
    tokens: Token[];

    @OneToMany(() => Demande, demande => demande.user)
    demandes: Demande[];

    @OneToMany(() => ParrainageDemande, parrainageDemande => parrainageDemande.demande)
    parrainageDemandes: ParrainageDemande[];



    constructor(id: number, nom:string, prenom:string,email: string ,motDePasse: string, role: UserRole, dateInscription:Date, estBenevole: boolean,parrain:User, parraine:User[],tokens: Token[], transactions: Transaction[],taches: Tache[], reservations: Reservation[], demandes: Demande[], parrainageDemandes:ParrainageDemande[]) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.dateInscription = dateInscription;
        this.estBenevole = estBenevole;
        this.parrain = parrain;
        this.parraine = parraine
        this.transactions = transactions;
        this.taches = taches;
        this.reservations = reservations;
        this.tokens = tokens;
        this.demandes = demandes
        this.parrainageDemandes = parrainageDemandes

    }
}