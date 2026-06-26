import { Module } from '@nestjs/common'
import { MockupService } from './mockup.service'
import { MockupController } from './mockup.controller'

@Module({
  providers: [MockupService],
  controllers: [MockupController],
  exports: [MockupService],
})
export class MockupModule {}
