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

    //jwt
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_SECRET: string;

    // S3
    S3_SECRET_KEY: string;
    S3_ACCESS_KEY: string;
    S3_BUCKET_NAME: string;
    S3_ENDPOINT: string;
  }
}
