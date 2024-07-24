import { Module } from '@nestjs/common';
import { QiniuapisController } from './controllers/qinniuapis.controller';
import { QiniuapisService } from './services/qinniuapis.service';

@Module({
  controllers: [QiniuapisController],
  providers: [QiniuapisService],
})
export class QiniuapisModule {}
