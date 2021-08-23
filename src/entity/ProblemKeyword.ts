import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name:"sd_problemkeywords"})
export class ProblemKeyword {

    @Column()
    problemid: number;

    @Column()
    keywordid: number;

    @Column()
    deleted: number;

    @PrimaryGeneratedColumn()
    ProblemKeywordid: number;
}