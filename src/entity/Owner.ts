import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name:"sd_owners"})
export class Owner {

    @PrimaryGeneratedColumn()
    ownerid: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    enabled: number;

    @Column()
    creationdate: string;

}