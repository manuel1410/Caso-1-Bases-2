
import {createConnection, Connection} from "typeorm";

/*  Para manejar correctamente el uso del pool de conexiones, hemos aplicado un diseño Singleton.
    Hemos creado aqui una clase que nos permite garantizar que crea una instacia (pool) en caso de
    que no exista, y en caso de existir devuelve la que ya esta creada. */ 

export class Pool {

    private static poolconnector: any; //Creamos un atributo donde guardamos el pool cuando se cree

    private constructor(){} //El constructor esta privado y vacio para evitar hacer llamadas directas tipo new Pool()
                            //Esto viene por parte del diseno Singleton. Para crear una instancia la hacemos con el metodo.

    public static getInstance(): Promise<Connection> {  //Metodo para crear una instancia o usar la que ya existe.
                                                        //Devuelve un Promise<Connection> para que se pueda usar luego con .then( etc...)
        if(!Pool.poolconnector){   //Verificamos si ya hay una instancia
            Pool.poolconnector = createConnection(); //Si no hay una instancia creada, creamos el connection pool
                                                     //El metodo de createconnection() hace automaticamente la conexion
            console.log("Se ha inicializado el pool");
        }

        return Pool.poolconnector; //En caso de que ya hubiera una instancia simplemente nos conectamos a la que ya existe.
    }
}