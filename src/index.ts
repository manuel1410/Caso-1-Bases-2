import "reflect-metadata";
import {createConnection, Connection, getManager, createConnections, getRepository} from "typeorm";
import {ActionType} from "./entity/ActionType";
import {Design} from "./entity/Design";
import {Keyword} from "./entity/Keyword";
import {Link} from "./entity/Link";
import {Owner} from "./entity/Owner";
import {Problem} from "./entity/Problem";
import {ProblemKeyword} from "./entity/ProblemKeyword";
import {ProblemLink} from "./entity/ProblemLink";
import {Solution} from "./entity/Solution";
import {SolutionLog} from "./entity/SolutionLog";
import {Pool} from "./Controller";

// Nosotros trabajamos con TYPEORM
// Manuel Casasola y Fiorella Arias

// EXPLICACION DE COMO SE MANIPULA EL OBJECT POOLING EN TYPEORM

// TypeORM genera un connection pool automaticamente, y usa cada
// una de las conexiones que ahí se encuentran para una sola 
// operación(toma la conexión, la usa y la libera para que alguien 
// más la use). 
// Si todas las conexiones están ocupadas, espera a que 
// se libere alguna de ellas y luego la usa.
// Por lo mencionado anteriormente es que no es necesario crear un
// nuevo connection pool, sin embargo, podemos manipular ese object
// pooling para así modificar la cantidad de conexiones permitidas por default.
// Para manipular el object pooling se pueden realizar las siguientes acciones:

//                      En el archivo "ormconfig.json", utilizamos las opciones "extra"
//                      y dentro de {} podemos realizar las siguientes acciones:
                                
//                          "connectionTimeout": determina el tiempo de cada conexion
//                          "max": establece un maximo de conexiones
//                          "min": establece un minimo de conexiones
//                          "connectionLimit": limita el numero de conexiones disponibles

// En este caso, para manipular el object pooling decidimos utilizas las opciones max, min y connectionTimeout.
// Se dará una nueva conexión cada vez utilice createConnection() o connection, y la cantidad de conexiones se
// regulará según explicamos anteriormente.

const conexion1 = Pool.getInstance();   //Aqui creamos un objeto para poder conectarnos al connection pool
                                        //En caso de que ya hayamos creado un connection pool se conecta al que ya se creo. 
                                        //Ver archivo Controller.ts, la clase es una clase con diseno Singleton.
const conexion2 = Pool.getInstance();   //Creamos una segunda conexion para verificar que se esten conectando a la misma instancia.

function pruebapool() {

    if(conexion1 === conexion2){
        console.log("El Singleton ha sido un exito"); //Si se prueba, vemos que si imprime esto.
    }
    else{
        console.log("El singleton ha fallado");
    }
}

pruebapool();


conexion1.then(async connection => {

    console.log("Conexion exitosa...");
    console.log("START");

    // -----------------------------------------------------------------------------------------

    //Prueba del ejemplo #1 relacion 1 a n

    //La relacion se hizo entre las entidades Solution y Design
    // 1 diseño se aplica a N soluciones 
    //para ver la declaracion, refierase a los archivos Design.ts y Solution.ts

    // se crean dos nuevas solutions
    
    const sol1 = new Solution();
    sol1.problemid=1;
    sol1.designid=5;
    sol1.comments="this is a new comment2";
    sol1.active=1;
    await connection.manager.save(sol1);

    console.log("Inserting 1...");
    
    const sol2 = new Solution();
    sol2.designid=4;
    sol2.problemid=2;
    sol2.comments="this is other comment2";
    sol2.active=1;
    await connection.manager.save(sol2);

    console.log("Inserting 2...");

    // se crea una insercion de un design 
    const dis = new Design();
    dis.title="new design2";
    dis.description="this is a new design2";
    dis.ownerid=1;
    dis.active=1;
    dis.solucion=[sol1,sol2];
    await connection.manager.save(dis);
    
    // se realiza un select de las tablas en las que se inserto para comprobar que la relacion creada funciona

    var DesignRepository = connection.getRepository(Design);
    var Designs = await DesignRepository.find({ relations: ['solucion'] })  // Hacemos es select en la tabla Design, traerá los datos de la tabla 
    .then((Designs:any) => {                                                // y un arreglo con los datos de la relación con solution
        console.log(JSON.stringify(Designs, null, 2)); //Si todo sale bien con la instrucción de select, mostramos los datos
        console.log("---------------------------------");
    })
    .catch((err:any) => {console.log(err)});  // si no sale bien, se muestra un error

    //---------------------------------------------------------
    //HACER UNA TRANSACCIÓN
    console.log("SE HACEN LAS DECLARACIONES");

    //Primero hay que hacer unos objetos que son los que vamos a insertar
    //de manera transaccional en la DB.

    const problem = new Problem(); // se crea un objeto de la entidad Problem y se le definen sus atributos
    problem.title = "Titulo Prueba TYPEORM";
    problem.description = "PRUEBA PRUEBA PRUEBA PRUEBA PRUEBA PRUEBA PRUEBA PRUEBA PRUEBA";
    problem.ownerid = 1;

    const link = new Link(); // se crea un objeto de la entidad Link y se le definen sus atributos
    link.url = "www.typeorm.com/pruebalink";

    console.log("SE INICIA LA TRANSACCION"); // A partir de aquí empieza el proceso de la transacción

    /* Este método de implementar transacciones en TYPEORM funciona a traves de un queryRunner.
       El queryRunner es lo que nos permite ejecutar queries de SQL en TYPEORM  */

    const queryRunner = connection.createQueryRunner(); //creamos el queryRunner como una conexion a la DB
    await queryRunner.connect(); //conectamos el queryRunner a la DB

    await queryRunner.startTransaction(); //Declaramos el inicio de la transaccion que vamos a hacer
                                          //con nuestro queryRunner
                                          
    /*  La transaccion que se realiza de ejemplo involucra tres tablas de la DB. 
        Las tablas sd_problems, sd_links y sd_problemlinks. 

        La idea es que cada vez que se genera un problema, se tiene que generar su respectivo link 
        y se tiene que hacer la asociacion entre el problema y el link a traves de la tabla intermedia sd_problemlinks,
        mediante una insercion a dicha tabla.

        Primero se crean el problema y el link. Y luego se insertan de manera transaccional.
        A su vez se crea el objeto de la relacion entre ambos y se hace la insercion.

        Cabe destacar que el ORM solo permite entidades (tablas) que contengan una comuna primaria (primary key).
        En el modelo de la DB solutionsdesigns hay dos tablas que no cumplen esto las cuales son: sd_problemkeywords y sd_problemlinks.
        Por lo que se le tuvo que hacer una modificacion en el diseno de la DB, agregandole una columna con un id para que se pudiera implementar.

    */
    try {
        /*AQUI VAN TODAS LAS INSTRUCCIONES QUE SE QUIERE QUE SE EJECUTEN EN LA TRANSACCION*/
                        /*TODAS DEBEN EJECUTARSE CON EL queryRunner*/ 
        await queryRunner.manager.save(problem); //Se ejecuta un save del objeto que habiamos definido anteriormente. (se hace el insert)
        await queryRunner.manager.save(link);    //Se ejecuta un save del objeto que habiamos definido anteriormente. (se hace el insert)

        const problemlink = new ProblemLink();   //Creamos el nuevo objeto que necesitamos insertar en medio de la transaccion
        problemlink.problemid = problem.problemid;
        problemlink.linkid = link.linkid;
    
        await queryRunner.manager.save(problemlink); //Guardamos el objeto en la tabla. (se hace el insert)

        await queryRunner.commitTransaction(); // Si la transaccion salió bien y todo se ejecuto sin problemas se realiza el commit.
        
        /* En caso de que algo hubiera dado error, se genera la excepcion y se pasa al catch.
           En el catch se ejecuta el rollback para que deshaga cualquier instruccion que se haya hecho antes. */

    } catch (err) {
        console.log('In transaction...'); //se muestra el error en la consola (para saber que paso)
        console.log(err);
        await queryRunner.rollbackTransaction(); //Se ejecuta rollback si se hubiera generado un algun error en el try
    }

    console.log("END");

}).catch(error => console.log(error));
