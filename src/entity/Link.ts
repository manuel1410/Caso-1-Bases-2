import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name:"sd_links"})
export class Link {

    @PrimaryGeneratedColumn()
    linkid: number;

    @Column()
    url: string;
}