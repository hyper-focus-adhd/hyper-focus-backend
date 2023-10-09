import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const message = this.messageRepository.create({
      ...createMessageDto,
      user: user,
    });

    console.log(message);
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

  // async identify(name: string, clientId: string) {}

  // findOne(id: number) {
  //   return `This action returns a #${id} message`;
  // }
  //
  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} message`;
  // }
}
