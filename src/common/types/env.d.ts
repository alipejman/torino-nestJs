namespace NodeJS {
  interface ProcessEnv {
    // Application
    PORT: number;

    // DataBase
    DB_PORT: number;
    DB_NAME: string;
    DB_HOST: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
  }
}
