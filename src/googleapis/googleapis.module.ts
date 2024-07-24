import { Module } from '@nestjs/common';
import { GoogleapisController } from './controllers/googleapis.controller';
import { GoogleapisService } from './services/googleapis.service';

@Module({
  controllers: [GoogleapisController],
  providers: [GoogleapisService],
})
export class GoogleapisModule {}
