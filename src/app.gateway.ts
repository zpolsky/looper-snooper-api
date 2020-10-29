import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { CodenamesService } from './codenames/codenames.service';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private codeNames: CodenamesService) {}
  @WebSocketServer() server: Server;

  private timerId: NodeJS.Timeout;
  private timeRemaining = 60;

  @SubscribeMessage('startTimer')
  startTimer(client: Socket): void {
    Logger.log(`Timer started by ${client.id}`);
    this.server.emit('timer', this.timeRemaining);
    this.timerId = setInterval(() => {
      this.timeRemaining -= 1;
      this.server.emit('timer', this.timeRemaining);
      if (this.timeRemaining === 0) {
        clearInterval(this.timerId);
      }
    }, 1000);
  }

  @SubscribeMessage('createGame')
  createGame(client: Socket): void {
    Logger.log(`Game created by ${client.id}`);
    const board = this.codeNames.createBoard();
    this.server.emit('createGame', JSON.stringify(board));
  }

  handleDisconnect(client: Socket): void {
    Logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]): void {
    Logger.log(`Client connected: ${client.id}`);
    this.server.emit('messageToClient', "Hello, who's this guy?");
    this.codeNames.createBoard();

  }
}
