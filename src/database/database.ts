
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
        "src/database/entities/*.ts"
    ],
    migrations:[
       "src/database/migrations/*.ts"
    ]
})