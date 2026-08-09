import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/route/public.decorator';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  getHealth() {
    return {
      status: 'ok',
    };
  }
}