
import { DataSource } from "typeorm";
import 'dotenv/config';


export const AppDataSource = new DataSource({
    type: process.env.TYPE as any,
    host: process.env.HOST,
    port: process.env.PORTDB as any,
    username: process.env.USERMYSQL,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    logging: true,
    synchronize: false,
    entities:[
        "dist/database/entities/*.js"
    ],
    migrations:[
       "dist/database/migrations/*.js"
    ],
    ssl: {
        rejectUnauthorized: false // Ajustez selon vos besoins de sécurité
      },
    "driver": require('mysql2')

})