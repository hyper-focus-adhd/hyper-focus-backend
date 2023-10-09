import { Logger } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { corsConfig } from '../../config/cors.config';
import { SocketAuthMiddleware } from '../auth/ws-auth.mw';
import { User } from '../users/entities/user.entity';

import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message.dto';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@ApiTags('Message')
@ApiSecurity('Access Token')
@Serialize(MessageDto)
@WebSocketGateway({
  namespace: 'api/v1/messages',
  cors: corsConfig.frontEndUrl,
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  afterInit(client: Socket): void {
    client.use(SocketAuthMiddleware() as never);
    Logger.log('afterInit');
  }

  @ApiOperation({ summary: 'Create a new message' })
  @SubscribeMessage('message')
  async createMessage(
    @CurrentUserId() user: User,
    @MessageBody() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const message = await this.messagesService.createMessage(
      user,
      createMessageDto,
    );

    this.server.emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllMessages')
  async joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    return await this.messagesService.identify(name, client.id);
  }

  // @SubscribeMessage('findAllMessages')
  // findAll() {
  //   return this.messagesService.findAll();
  // }
  //

  //
  // @SubscribeMessage('findAllMessages')
  // typing() {
  //   return this.messagesService.findAll();
  // }

  // @SubscribeMessage('findOneMessage')
  // findOne(@MessageBody() id: number) {
  //   return this.messagesService.findOne(id);
  // }
  //
  // @SubscribeMessage('updateMessage')
  // update(@MessageBody() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  // }
  //
  // @SubscribeMessage('removeMessage')
  // remove(@MessageBody() id: number) {
  //   return this.messagesService.remove(id);
  // }
}
