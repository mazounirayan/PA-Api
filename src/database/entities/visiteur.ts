import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne} from "typeorm"
import "reflect-metadata"
import { User } from "./user"
import { Demande } from "./demande"
import { Inscription } from "./inscription"
import { ParrainageDemande } from "./parrainageDemande"
import { Transaction } from "./transaction"

@Entity()
export class Visiteur {
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
    age: number

    @Column()
    numTel: string

    @Column()
    adresse: string

    @Column()
    profession: string

    @Column()
    @CreateDateColumn({type: "datetime"})
    dateInscription: Date

    @Column()
    estBenevole: boolean

    @ManyToOne(() => User, user => user.parraine)
    parrain: User;

    @OneToMany(() => Transaction, transactions => transactions.visiteur)
    transactions: Transaction[];

    @OneToMany(() => Inscription, inscriptions => inscriptions.visiteur)
    inscriptions: Inscription[];

    @OneToMany(() => Demande, demande => demande.visiteur)
    demandes: Demande[];

    constructor(id: number, nom: string, prenom: string, email: string, age: number, numTel: string, adresse: string, profession: string, dateInscription: Date, estBenevole: boolean, parrain: User, transactions: Transaction[], inscriptions: Inscription[], demandes: Demande[]) {
        this.id = id
        this.nom = nom
        this.prenom = prenom
        this.email = email
        this.age = age
        this.numTel = numTel
        this.adresse = adresse
        this.profession = profession
        this.dateInscription = dateInscription
        this.estBenevole = estBenevole
        this.parrain = parrain
        this.transactions = transactions;
        this.inscriptions = inscriptions;
        this.demandes = demandes
    }
}