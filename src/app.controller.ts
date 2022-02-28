import { Body, Controller, Post } from '@nestjs/common';
import { Name } from './decorators/name.decorator';
import { GreetingDto } from './dtos/greeting.dto';

@Controller()
export class AppController {
  @Post('/greetings')
  postGreeting(@Name() name: string, @Body() greeting: GreetingDto): string {
    return `${greeting.greeting} ${name}, how are you today?`;
  }
}
