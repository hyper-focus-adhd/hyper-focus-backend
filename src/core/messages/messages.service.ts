import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../common/helpers/messages-helper';
import { User } from '../users/entities/user.entity';

import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createMessage(
    user: User,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const sortedULIDs = _.sortBy([user, createMessageDto.secondUserId]);
    const chatId = sortedULIDs.join('');

    const message = this.messageRepository.create({
      chat_id: chatId,
      text: createMessageDto.text,
      user: user,
    });

    const foundMessage = await this.messageRepository.save(message);

    return this.findOneMessageOrFail({
      where: { id: foundMessage.id },
      relations: ['user'],
    });
  }

  async findOneMessageOrFail(
    options: FindOneOptions<Message>,
  ): Promise<Message> {
    try {
      return await this.messageRepository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new NotFoundException(messagesHelper.MESSAGE_NOT_FOUND);
    }
  }

  async findAllMessages(): Promise<Message[]> {
    const messages = await this.messageRepository.find({
      relations: ['user'],
    });

    if (!messages.length) {
      throw new NotFoundException(messagesHelper.POST_NOT_FOUND);
    }

    return messages;
  }

  async findAllMessagesByChatId(
    user: User,
    secondUserId: string,
  ): Promise<Message[]> {
    const sortedULIDs = _.sortBy([user, secondUserId]);
    const chatId = sortedULIDs.join('');

    return await this.messageRepository.find({
      where: { chat_id: chatId },
      relations: ['user'],
    });
  }
}
