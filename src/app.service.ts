import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly looger = new Logger(AppService.name);

  getHello(): string {
    this.looger.log('Alguém chamou o método getHello()');
    return 'Hello World!';
  }
}
