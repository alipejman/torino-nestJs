import { config } from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";

config({
    path: join(process.cwd(), ".env")
})
const {DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME, DB_PORT} = process.env;

let dataSource = new DataSource({
    type: "postgres",
    database: DB_NAME,
    username: DB_USERNAME,
    host: DB_HOST,
    port: +DB_PORT, 
    password: DB_PASSWORD,
    synchronize: false,
    logging: true,
    entities: [
        "dist/**/**/**/*.entity{.js,.ts}",
        "dist/**/**/*.entity{.js,.ts}",
    ],
    migrations: [
        "dist/src/migrations/*{.js,.ts}",
    ],
    migrationsTableName: "torino_migration_db"

})

export default dataSource;