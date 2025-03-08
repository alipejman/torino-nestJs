import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
const { SwaggerTheme, SwaggerThemeNameEnum } = require('swagger-themes');

export function swaggerConfigInit(app: INestApplication) {
    const document = new DocumentBuilder()
    .setTitle("Torino-NestJs")
    .setDescription("Online Tour Reservation")
    .setVersion("0.0.1")
    .addBearerAuth(swaggerAuthConfig(), "Authorization")
    .build()
    const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.MATERIAL)
  };
    const swaggerDocument = SwaggerModule.createDocument(app, document);
    SwaggerModule.setup("/api", app, swaggerDocument, options)
}

export function swaggerAuthConfig(): SecuritySchemeObject {
    return {
        type: "http",
        bearerFormat: "JWT",
        in: "header",
        scheme: "bearer",
    };
}