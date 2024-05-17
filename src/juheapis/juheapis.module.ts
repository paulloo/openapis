import { Module } from '@nestjs/common';

import { JuheapisController } from './controllers/juheapis.controller';
import { JuheapisService } from './services/juheapis.service';

@Module({
  controllers: [JuheapisController],
  providers: [JuheapisService],
})
export class JuheapisModule {}
