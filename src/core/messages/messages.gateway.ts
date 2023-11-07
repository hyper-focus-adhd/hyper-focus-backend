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
import { SocketAuthMiddleware } from '../auth/middlewares/ws-auth.mw';
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
  @SubscribeMessage('createMessage')
  async createMessage(
    @CurrentUserId() user: User,
    @MessageBody() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const message = await this.messagesService.createMessage(
      user,
      createMessageDto,
    );

    this.server.to(message.chat_id).emit('message', message);

    return message;
  }

  @ApiOperation({ summary: 'Join a chat' })
  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @CurrentUserId() user: User,
    @ConnectedSocket() client: Socket,
    @MessageBody() secondUserId: string,
  ): Promise<void> {
    const chatId = await this.messagesService.findChatId(user, secondUserId);

    client.join(chatId);
  }

  @ApiOperation({ summary: 'Find all messages' })
  @SubscribeMessage('findAllMessages')
  async findAllMessages(): Promise<Message[]> {
    return await this.messagesService.findAllMessages();
  }

  @ApiOperation({ summary: 'Find all messages by chat id' })
  @SubscribeMessage('findAllMessagesByChatId')
  async findAllMessagesByChatId(
    @CurrentUserId() user: User,
    @MessageBody() secondUserId: string,
  ): Promise<Message[]> {
    return await this.messagesService.findAllMessagesByChatId(
      user,
      secondUserId,
    );
  }
}
