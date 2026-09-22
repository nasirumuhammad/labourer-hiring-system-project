import { Controller, Get, MessageEvent, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { interval, map, Observable, of } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/stream')
  stream() {
    const numbers$ = interval(1000);
    const subscription = numbers$.subscribe((value) => {
      console.log(value);
    });
    setTimeout(() => {
      subscription.unsubscribe();
    }, 5000);

    return 'Check your terminal';
  }
}
