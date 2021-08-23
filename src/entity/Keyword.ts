import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name:"sd_keywords"})
export class Keyword {

    @PrimaryGeneratedColumn()
    keywordid: number;

    @Column()
    word: string;
}