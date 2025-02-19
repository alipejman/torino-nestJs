import { NestFactory } from '@nestjs/core';
import { swaggerConfigInit } from './config/swagger.config';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfigInit(app);
 const {PORT = 3000} = process.env;
  await app.listen(PORT, () => {
    console.log(`Server Is Running On Port : ${PORT} : http://localhost:${PORT}`);
    console.log(`Server API : http://localhost:${PORT}/api`);
  })
}

bootstrap();
