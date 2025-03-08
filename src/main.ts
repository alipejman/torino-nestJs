import { NestFactory } from "@nestjs/core";
import { swaggerConfigInit } from "./config/swagger.config";
import { AppModule } from "./modules/app/app.module";
import * as cookieParser from "cookie-parser";
import { config } from "dotenv";
import { PassportStrategy } from "@nestjs/passport";
import { ValidationPipe } from "@nestjs/common";
const bodyParser = require("body-parser");
const result = config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  swaggerConfigInit(app);
  app.use(bodyParser.json({ limit: "1mb" })); 
  app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
  const { PORT = 8080 } = process.env;
  await app.listen(PORT, () => {
    console.log(
      `Server Is Running On Port : ${PORT} : http://localhost:${PORT}`
    );
    console.log(`Server API : http://localhost:${PORT}/api`);
  });

  process.on("SIGTERM", () => {
    app.close().then(() => {
      console.log("Application closed");
      process.exit(0);
    });
  });
}

bootstrap();
