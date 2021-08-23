import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name:"sd_problems"})
export class Problem {

    @PrimaryGeneratedColumn()
    problemid: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    creationdate: string;

    @Column()
    active: number;

    @Column()
    ownerid: number;
}